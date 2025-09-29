import utils from "@strapi/utils";
import { Strapi } from "@strapi/strapi";
const { ValidationError } = utils.errors;
import { processMeData } from "../utils/fetch-me";
import { generateReferralCode } from "../utils";
import { promiseHandler } from "../utils/promiseHandler";

interface Params {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	strapi: Strapi | any;
}

// Default email pattern - matches the default in server/config/index.ts
const DEFAULT_EMAIL_PATTERN = '{randomString}@phone-user.firebase.local';

/**
 * Generate a fake email for phone-only users based on configured pattern
 * @param phoneNumber - Optional phone number (e.g., "+1-234-567-8900")
 * @param pattern - Optional email pattern template with tokens
 * @returns Generated unique email address
 * @throws Error if unable to generate unique email after MAX_RETRIES attempts
 */
const createFakeEmail = async (phoneNumber?: string, pattern?: string) => {
	const MAX_RETRIES = 3;
	let retryCount = 0;

	const emailPattern = pattern || DEFAULT_EMAIL_PATTERN;

	while (retryCount < MAX_RETRIES) {
		const randomString = generateReferralCode(8).toLowerCase();
		const timestamp = Date.now().toString();
		const phoneDigits = phoneNumber ? phoneNumber.replace(/[^0-9]/g, '') : '';

		let fakeEmail = emailPattern
			.replace('{randomString}', randomString)
			.replace('{timestamp}', timestamp)
			.replace('{phoneNumber}', phoneDigits);

		const existingUser = await strapi.db
			.query("plugin::users-permissions.user")
			.findOne({
				where: { email: fakeEmail },
			});

		if (!existingUser) {
			return fakeEmail;
		}

		retryCount++;
	}

	throw new ValidationError(
		`[Firebase Auth Plugin] Failed to generate unique email after ${MAX_RETRIES} attempts.\n` +
		`Pattern used: "${emailPattern}"\n` +
		`Phone number: "${phoneNumber || 'N/A'}"\n\n` +
		`This usually means your emailPattern doesn't include enough uniqueness.\n` +
		`Make sure your pattern includes {randomString} or {timestamp} tokens.\n\n` +
		`Valid pattern examples:\n` +
		`  - "phone_{phoneNumber}_{randomString}@myapp.local"\n` +
		`  - "user_{timestamp}@temp.local"\n` +
		`  - "{randomString}@phone-user.firebase.local"`
	);
};

export default ({ strapi }: Params) => ({
	async getUserAttributes() {
		return strapi.plugins["users-permissions"].contentTypes["user"].attributes;
	},
	delete: async (entityId) => {
		await strapi.firebase.auth().deleteUser(entityId);
		return { success: true };
	},

	validateExchangeTokenPayload: async (requestPayload) => {
		const { idToken } = requestPayload;

		if (!idToken || idToken.length === 0) {
			throw new ValidationError("idToken is missing!");
		}

		return strapi.firebase.auth().verifyIdToken(idToken);
	},

	decodeIDToken: async (idToken) => {
		return await strapi.firebase.auth().verifyIdToken(idToken);
	},

	overrideFirebaseAccess: async (ctx) => {
		if (!ctx.request.body || !ctx.request.body.overrideUserId) {
			return ctx.badRequest(null, [{ messages: [{ id: "unauthorized" }] }]);
		}

		const overrideUserId = ctx.request.body.overrideUserId;

		const user =
			await strapi.plugins["users-permissions"].services.user.fetch(
				overrideUserId,
			);

		const jwt = await strapi.plugins["users-permissions"].services.jwt.issue({
			id: user.id,
		});

		ctx.body = {
			user: await processMeData(user),
			jwt,
		};

		return ctx.body;
	},

	async checkIfUserExists(decodedToken) {
		const userModel = await this.getUserAttributes();

		let query: any = {};
		let dbUser = null;

		// First Check if the user exists in the database with firebaseUserId
		if (
			userModel.hasOwnProperty("firebaseUserId") &&
			(decodedToken.user_id || decodedToken.uid)
		) {
			const firebaseUserId = decodedToken.user_id || decodedToken.uid;
			dbUser = await strapi.db.query("plugin::users-permissions.user").findOne({
				where: {
					firebaseUserId,
				},
			});
			if (dbUser) {
				return dbUser;
			}
		}

		query.$or = [];

		// Check if email is available and construct query
		if (decodedToken.email) {
			query.$or.push({ email: decodedToken.email });
			// Extend the query with appleEmail if that attribute exists in the userModel
			if (userModel.hasOwnProperty("appleEmail")) {
				query.$or.push({ appleEmail: decodedToken.email });
			}
		}

		// Add phone number to query if available
		if (decodedToken.phone_number) {
			query.$or.push({ phoneNumber: decodedToken.phone_number });
		}

		// Execute a single database query with constructed conditions
		dbUser = await strapi.db.query("plugin::users-permissions.user").findOne({
			where: query,
		});

		// Return user or null if not found
		return dbUser;
	},

	fetchUser: async (decodedToken) => {
		const { data: user, error } = await promiseHandler(
			strapi.db.query("plugin::users-permissions.user").findOne({
				where: {
					firebaseUserId: decodedToken.uid,
				},
			}),
		);

		if (error) {
			throw new ValidationError(error?.message || "User not found", error);
		}

		return user;
	},

	generateJWTForCurrentUser: async (user) => {
		return strapi.plugins["users-permissions"].services.jwt.issue({
			id: user.id,
		});
	},

	async createStrapiUser(decodedToken, idToken, profileMetaData) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userPayload: any = {};

		const pluginStore = await strapi.store({
			environment: "",
			type: "plugin",
			name: "users-permissions",
		});

		const settings = await pluginStore.get({
			key: "advanced",
		});

		const role = await strapi.db
			.query("plugin::users-permissions.role")
			.findOne({ where: { type: settings.default_role } });
		userPayload.role = role.id;
		userPayload.firebaseUserId = decodedToken.uid;
		userPayload.confirmed = true;

		userPayload.email = decodedToken.email;
		userPayload.phoneNumber = decodedToken.phone_number;
		userPayload.idToken = idToken;
		if (profileMetaData) {
			userPayload.firstName = profileMetaData?.firstName;
			userPayload.lastName = profileMetaData?.lastName;
			userPayload.phoneNumber = profileMetaData?.phoneNumber;
		}

		if (decodedToken.email) {
			const emailComponents = decodedToken.email.split("@");
			userPayload.username = emailComponents[0];
			if (emailComponents[1].includes("privaterelay.appleid.com")) {
				userPayload.appleEmail = decodedToken.email;
			}
		} else {
			// Phone-only user - handle email based on plugin configuration
			userPayload.username = userPayload.phoneNumber;

			const emailRequired = strapi.plugin("firebase-auth").config("emailRequired");
			const emailPattern = strapi.plugin("firebase-auth").config("emailPattern");

			if (profileMetaData?.email) {
				userPayload.email = profileMetaData.email;
			} else if (emailRequired) {
				userPayload.email = await createFakeEmail(userPayload.phoneNumber, emailPattern);
			} else {
				userPayload.email = null;
			}
		}

		return strapi
			.query("plugin::users-permissions.user")
			.create({ data: userPayload });
	},

	updateUserIDToken: async (user, idToken, decodedToken) => {
		return strapi.db.query("plugin::users-permissions.user").update({
			where: {
				id: user.id,
			},
			data: { idToken, firebaseUserId: decodedToken.uid },
		});
	},

	validateFirebaseToken: async (ctx) => {
		const { profileMetaData } = ctx.request.body;
		const { error } = await promiseHandler(
			strapi
				.plugin("firebase-auth")
				.service("firebaseService")
				.validateExchangeTokenPayload(ctx.request.body),
		);
		if (error) {
			ctx.status = 400;
			return { error: error.message };
		}

		const { idToken } = ctx.request.body;
		const populate = ctx.request.query.populate || [];

		const decodedToken = await strapi
			.plugin("firebase-auth")
			.service("firebaseService")
			.decodeIDToken(idToken);

		let user;

		user = await strapi
			.plugin("firebase-auth")
			.service("firebaseService")
			.checkIfUserExists(decodedToken, profileMetaData);

		let jwt;

		if (!user) {
			// create strapi user
			user = await strapi
				.plugin("firebase-auth")
				.service("firebaseService")
				.createStrapiUser(decodedToken, idToken, profileMetaData);
		}

		jwt = await strapi
			.plugin("firebase-auth")
			.service("firebaseService")
			.generateJWTForCurrentUser(user);

		strapi
			.plugin("firebase-auth")
			.service("firebaseService")
			.updateUserIDToken(user, idToken, decodedToken);

		return {
			user: await processMeData(user, populate),
			jwt,
		};
	},
});
