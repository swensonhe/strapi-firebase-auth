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

const createFakeEmail = async () => {
	let randomString = generateReferralCode(8).toLowerCase();
	const fakeEmail = `${randomString}@maz.com`;
	let anotherUserWithTheSameReferralCode = await strapi.db
		.query("plugin::users-permissions.user")
		.findOne({
			where: { email: fakeEmail },
		});

	while (anotherUserWithTheSameReferralCode) {
		randomString = generateReferralCode(8);
		anotherUserWithTheSameReferralCode = await strapi.db
			.query("plugin::users-permissions.user")
			.findOne({
				where: { email: fakeEmail },
			});
	}

	return fakeEmail;
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
<<<<<<< Updated upstream
=======
		let dbUser = null;

		// First Check if the user exists in the database with firebaseUserID
		if (
			userModel.hasOwnProperty("firebaseUserID") &&
			(decodedToken.user_id || decodedToken.uid)
		) {
			const firebaseUserID = decodedToken.user_id || decodedToken.uid;
			dbUser = await strapi.db.query("plugin::users-permissions.user").findOne({
				where: {
					firebaseUserID,
				},
			});
			if (dbUser) {
				return dbUser;
			}
		}

		query.$or = [];
>>>>>>> Stashed changes

		// Check if email is available and construct query
		if (decodedToken.email) {
			query.$or = [{ email: decodedToken.email }];
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
					firebaseUserID: decodedToken.uid,
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
		userPayload.firebaseUserID = decodedToken.uid;
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
			userPayload.username = userPayload.phoneNumber;
			userPayload.email = profileMetaData?.email || (await createFakeEmail());
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
			data: { idToken, firebaseUserID: decodedToken.uid },
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
