import utils from "@strapi/utils";
import { Strapi } from "@strapi/strapi";
const { ValidationError } = utils.errors;
import { processMeData } from "../utils/fetch-me";
import { generateReferralCode } from "../utils";

interface Params {
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

    const user = await strapi.plugins["users-permissions"].services.user.fetch(
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

  checkIfUserExists: async (decodedToken) => {
    let user;

    if (decodedToken.email) {
      user = await strapi.db.query("plugin::users-permissions.user").findOne({
        where: {
          $or: [
            { appleEmail: decodedToken.email },
            { email: decodedToken.email },
          ],
        },
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

  createStrapiUser: async (decodedToken, idToken) => {
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
      .checkIfUserExists(decodedToken);

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
        .createStrapiUser(decodedToken);
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
