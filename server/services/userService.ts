import utils from "@strapi/utils";
const { ApplicationError } = utils.errors;
import paginate from "../utils/paginate";
import { formatUserData } from "../utils/users";

export default ({ strapi }) => ({
  get: async (entityId: string) => {
    try {
      const user = await strapi.firebase.auth().getUser(entityId);
      const firebaseUser = user.toJSON();

      return firebaseUser;
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },

  create: async (payload) => {
    try {
      const userRecord = await strapi.firebase
        .auth()
        .getUserByEmail(payload.email)
        .catch(async (e) => {
          if (e.code === "auth/user-not-found") {
            const response = await strapi.firebase.auth().createUser(payload);

            return response.toJSON();
          }
        });

      if (userRecord) {
        return userRecord;
      }
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },

  register: async (userID, payload) => {
    try {
      const res = await strapi
        .plugin("firebase-auth")
        .service("userService")
        .create(payload);
      const actionCodeSettings = {
        url: process.env.BASE_URL,
      };
      const link = await strapi.firebase
        .auth()
        .generatePasswordResetLink(payload.email, actionCodeSettings);
      await strapi.plugin("users-permissions").service("user").edit(userID, {
        firebaseUserID: res.uid,
        passwordResetLink: link,
      });
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },

  list: async (pagination, nextPageToken) => {
    const response = await strapi.firebase
      .auth()
      .listUsers(parseInt(pagination.pageSize), nextPageToken);
    const totalUserscount = await strapi.firebase.auth().listUsers();
    const strapiUsers = await strapi.db
      .query("plugin::users-permissions.user")
      .findMany();

    const allUsers = formatUserData(response, strapiUsers);

    const { meta } = paginate(
      response.users,
      totalUserscount.users.length,
      pagination,
    );
    return { data: allUsers.users, pageToken: response.pageToken, meta };
  },

  updateFirebaseUser: async (entityId, payload) => {
    try {
      return await strapi.firebase.auth().updateUser(entityId, payload);
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },
  update: async (entityId, payload) => {
    try {
      const firebasePromise = strapi.firebase
        .auth()
        .updateUser(entityId, payload);

      return Promise.allSettled([firebasePromise]);
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },
  resetPasswordFirebaseUser: async (entityId, payload) => {
    try {
      return await strapi.firebase.auth().updateUser(entityId, payload);
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },
  resetPasswordStrapiUser: async (entityId, payload) => {
    try {
      return strapi
        .query("plugin::users-permissions.user")
        .update({ where: { firebaseUserID: entityId }, data: payload });
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },
  resetPassword: async (entityId, payload) => {
    try {
      const firebasePromise = strapi.firebase
        .auth()
        .updateUser(entityId, payload);
      const strapiPromise = strapi
        .query("plugin::users-permissions.user")
        .update({ where: { firebaseUserID: entityId }, data: payload });

      return Promise.allSettled([firebasePromise, strapiPromise]);
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },
  delete: async (entityId) => {
    try {
      const firebasePromise = strapi.firebase.auth().deleteUser(entityId);
      const strapiPromise = strapi
        .query("plugin::users-permissions.user")
        .delete({ where: { firebaseUserID: entityId } });
      return Promise.allSettled([firebasePromise, strapiPromise]);
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },
  deleteFirebaseUser: async (entityId) => {
    try {
      const response = await strapi.firebase.auth().deleteUser(entityId);
      return response;
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },
  deleteStrapiUser: async (entityId) => {
    try {
      const response = await strapi
        .query("plugin::users-permissions.user")
        .delete({ where: { firebaseUserID: entityId } });
      return response;
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },
  deleteMany: async (entityIDs) => {
    try {
      const response = await strapi.firebase
        .auth()
        .deleteUsers(JSON.parse(entityIDs));
      return response;
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },
});
