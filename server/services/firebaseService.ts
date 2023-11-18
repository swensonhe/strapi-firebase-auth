import utils from "@strapi/utils";
import { Strapi } from "@strapi/strapi";
const { ValidationError } = utils.errors;
import { processMeData } from "../utils/fetch-me";
import { generateReferralCode } from "../utils";

interface Params {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  strapi: Strapi | any;
}

const createFakeEmail = async () => {
  let randomString = generateReferralCode(8).toLowerCase();
  const fakeEmail = `${randomString}@$maz.com`;
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
    console.log(
      "000011111",
      strapi.plugins["users-permissions"].contentTypes["user"].attributes,
    );
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

    try {
      await strapi.firebase.auth().verifyIdToken(idToken);
    } catch (e) {
      throw new ValidationError(e.message);
    }
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
    let user;

    if (decodedToken.email) {
      const userModel = await this.getUserAttributes();

      const filter = Object.keys(userModel).find((key) => key === "appleEmail")
        ? {
            $or: [
              { appleEmail: decodedToken.email },
              { email: decodedToken.email },
            ],
          }
        : {
            $or: [{ email: decodedToken.email }],
          };
      console.log("decodedToken.email", decodedToken.email);
      user = await strapi.db.query("plugin::users-permissions.user").findOne({
        where: filter,
      });
    } else if (decodedToken.phone_number) {
      user = await strapi.db.query("plugin::users-permissions.user").findOne({
        where: {
          phoneNumber: decodedToken.phone_number,
        },
      });
    } else {
      user = await strapi.db.query("plugin::users-permissions.user").findOne({
        where: {
          firebaseUserID: decodedToken.user_id || decodedToken.uid,
        },
      });
    }

    return !!user;
  },

  fetchUser: async (decodedToken) => {
    let user;
    //TODO FIGURE OUT HOW TO HANDLE fIREBASE USER ID

    user = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: {
        firebaseUserID: decodedToken.uid,
      },
    });

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
    userPayload.firstName = profileMetaData.firstName;
    userPayload.lastName = profileMetaData.lastName;
    userPayload.phoneNumber = profileMetaData.phoneNumber;

    if (decodedToken.email) {
      const emailComponents = decodedToken.email.split("@");
      userPayload.username = emailComponents[0];
      if (emailComponents[1].includes("privaterelay.appleid.com")) {
        userPayload.appleEmail = decodedToken.email;
      }
    } else {
      userPayload.username = userPayload.phoneNumber;
      userPayload.email = await createFakeEmail();
    }

    return strapi
      .query("plugin::users-permissions.user")
      .create({ data: userPayload });
  },

  updateUserIDToken: async (user, idToken) => {
    return strapi.db.query("plugin::users-permissions.user").update({
      where: {
        id: user.id,
      },
      data: { idToken },
    });
  },

  validateFirebaseToken: async (ctx) => {
    const { profileMetaData } = ctx.request.body;
    await strapi
      .plugin("firebase-auth")
      .service("firebaseService")
      .validateExchangeTokenPayload(ctx.request.body);

    const { idToken } = ctx.request.body;
    const populate = ctx.request.query.populate || [];

    const decodedToken = await strapi
      .plugin("firebase-auth")
      .service("firebaseService")
      .decodeIDToken(idToken);

    const userExists = await strapi
      .plugin("firebase-auth")
      .service("firebaseService")
      .checkIfUserExists(decodedToken, profileMetaData);

    let user, jwt;

    if (userExists) {
      user = await strapi
        .plugin("firebase-auth")
        .service("firebaseService")
        .fetchUser(decodedToken);
    }

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
      .updateUserIDToken(user, idToken);

    return {
      user: await processMeData(user, populate),
      jwt,
    };
  },
});
