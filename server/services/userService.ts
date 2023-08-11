"use strict";

import utils from "@strapi/utils";
const { ApplicationError } = utils.errors;
import paginate from "../utils/paginate";

const PHONE = "phone";

export default ({ strapi }) => ({


  get: async (entityId: string) => {
    try {
      const user = await strapi.firebase.auth().getUser(entityId);
      const firebaseUser = user.toJSON();
      const providerData = firebaseUser.providerData[0];
      let query;
      if (providerData.providerId === PHONE) {
        query = {
          phoneNumber: {
            $eq: providerData.uid,
          },
        };
      } else {
        query = {
          $or: [
            {
              email: providerData.email,
            },
            {
              appleEmail: providerData.email,
            }
            // {
            //   alternateEmail: providerData.email,
            // },
          ],
        };
      }
      const localUser = await strapi.db.query("plugin::users-permissions.user").findOne({ where: query });
      firebaseUser.localUser = localUser;
      return firebaseUser;
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },

  create: async payload => {
    try {
      const userRecord = await strapi.firebase.auth().getUserByEmail(payload.email);
      if (userRecord) {
        return userRecord.toJSON();
      }
      const response = await strapi.firebase.auth().createUser(payload);
      return response.toJSON();
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },

  register: async (userID, payload) => {
    try {
      const res = await strapi.plugin("firebase-auth").service("userService").create(payload);
      const actionCodeSettings = {
        url: process.env.BASE_URL,
      };
      const link = await strapi.firebase.auth().generatePasswordResetLink(payload.email, actionCodeSettings);
      await strapi.plugin("users-permissions").service("user").edit(userID, {
        firebaseUserID: res.uid,
        passwordResetLink: link,
      });
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },

  list: async (pagination, nextPageToken) => {
    let response = await strapi.firebase.auth().listUsers(parseInt(pagination.pageSize), nextPageToken);

    const { meta } = paginate(response.users, pagination);
    return { data: response.users, pageToken: response.pageToken, meta };
  },

  update: async (entityId, payload) => {
    try {
      return await strapi.firebase.auth().updateUser(entityId, payload);
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },

  delete: async entityId => {
    try {
      const candidateUser = await strapi.plugin("firebase-auth").service("userService").get(entityId);
      await strapi.firebase.auth().deleteUser(entityId);
      return candidateUser;
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },

  deleteMany: async entityIDs => {
    try {
      const response = await strapi.firebase.auth().deleteUsers(JSON.parse(entityIDs));
      return response;
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },
});
