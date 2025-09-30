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
      // Support lookup by email OR phone number
      let getUserPromise;
      if (payload.email) {
        getUserPromise = strapi.firebase.auth().getUserByEmail(payload.email);
      } else if (payload.phoneNumber) {
        getUserPromise = strapi.firebase.auth().getUserByPhoneNumber(payload.phoneNumber);
      } else {
        throw new ApplicationError('Either email or phoneNumber is required');
      }

      const userRecord = await getUserPromise.catch(async (e) => {
        if (e.code === "auth/user-not-found") {
          const response = await strapi.firebase.auth().createUser(payload);
          return response.toJSON();
        }
        throw e;
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
        firebaseUserId: res.uid,
        passwordResetLink: link,
      });
    } catch (e) {
      throw new ApplicationError(e.message.toString());
    }
  },

  list: async (pagination, nextPageToken, sort) => {
    // When sorting, fetch ALL users to sort the complete dataset
    let allFirebaseUsers;
    if (sort) {
      allFirebaseUsers = await strapi.firebase.auth().listUsers();
    } else {
      // Normal pagination - fetch only the requested page
      allFirebaseUsers = await strapi.firebase
        .auth()
        .listUsers(parseInt(pagination.pageSize), nextPageToken);
    }

    const totalUserscount = await strapi.firebase.auth().listUsers();
    const strapiUsers = await strapi.db
      .query("plugin::users-permissions.user")
      .findMany();

    const allUsers = formatUserData(allFirebaseUsers, strapiUsers);

    let sortedUsers = allUsers.users;
    let paginatedData = sortedUsers;

    if (sort) {
      const [sortField, sortOrder] = sort.split(':');

      sortedUsers = [...allUsers.users].sort((a, b) => {
        const aValue = a[sortField] || '';
        const bValue = b[sortField] || '';

        // Handle null/undefined values
        if (!aValue && !bValue) return 0;
        if (!aValue) return 1;
        if (!bValue) return -1;

        const comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());

        return sortOrder === 'DESC' ? -comparison : comparison;
      });

      // Apply pagination after sorting - ensure page is at least 1
      const page = pagination.page || 1;
      const pageSize = parseInt(pagination.pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      paginatedData = sortedUsers.slice(startIndex, endIndex);
    }

    const { meta } = paginate(
      sort ? sortedUsers : allFirebaseUsers.users,
      totalUserscount.users.length,
      pagination,
    );
    return { data: paginatedData, pageToken: allFirebaseUsers.pageToken, meta };
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
        .update({ where: { firebaseUserId: entityId }, data: payload });
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
        .update({ where: { firebaseUserId: entityId }, data: payload });

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
        .delete({ where: { firebaseUserId: entityId } });
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
        .delete({ where: { firebaseUserId: entityId } });
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
  async setSocialMetaData() {},
});
