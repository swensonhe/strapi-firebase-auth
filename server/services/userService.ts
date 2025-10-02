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

  list: async (pagination, nextPageToken, sort, searchQuery) => {
    // If search query exists, try exact match lookups first
    if (searchQuery) {
      try {
        let foundUser = null;

        // Trim whitespace and normalize the search query
        searchQuery = searchQuery.trim();

        // Try exact phone lookup first (if it starts with + or looks like a phone)
        if (searchQuery.startsWith('+') || searchQuery.match(/^\d{10,15}$/)) {
          // Ensure phone has + prefix for Firebase lookup
          const phoneWithPlus = searchQuery.startsWith('+') ? searchQuery : `+${searchQuery}`;
          try {
            foundUser = await strapi.firebase.auth().getUserByPhoneNumber(phoneWithPlus);
          } catch (e) {
            // Not a valid phone, continue
          }
        }

        // Try exact email lookup
        if (!foundUser && searchQuery.includes('@')) {
          try {
            foundUser = await strapi.firebase.auth().getUserByEmail(searchQuery);
          } catch (e) {
            // Not a valid email, continue
          }
        }

        // Try exact UID lookup (Firebase UIDs are alphanumeric strings)
        if (!foundUser && searchQuery.length >= 20) {
          try {
            foundUser = await strapi.firebase.auth().getUser(searchQuery);
          } catch (e) {
            // Not a valid UID, continue
          }
        }

        // Try Strapi ID lookup (short numbers only, to avoid confusion with phone)
        if (!foundUser && searchQuery.match(/^\d{1,6}$/)) {
          try {
            const strapiUser = await strapi.db
              .query("plugin::users-permissions.user")
              .findOne({ where: { id: parseInt(searchQuery) } });

            if (strapiUser?.firebaseUserId) {
              foundUser = await strapi.firebase.auth().getUser(strapiUser.firebaseUserId);
            } else if (strapiUser) {
              // Fallback: Try to find Firebase user by email or phone from Strapi data
              if (strapiUser.email) {
                try {
                  foundUser = await strapi.firebase.auth().getUserByEmail(strapiUser.email);
                } catch (e) {
                  // Email lookup failed, continue
                }
              }

              if (!foundUser && strapiUser.phoneNumber) {
                try {
                  foundUser = await strapi.firebase.auth().getUserByPhoneNumber(strapiUser.phoneNumber);
                } catch (e) {
                  // Phone lookup failed, continue
                }
              }
            }
          } catch (e) {
            // Not a valid Strapi ID, continue
          }
        }

        // If we found an exact match, return it immediately
        if (foundUser) {
          const totalUserscount = await strapi.firebase.auth().listUsers();
          const strapiUsers = await strapi.db
            .query("plugin::users-permissions.user")
            .findMany();

          const formattedUser = formatUserData({ users: [foundUser] }, strapiUsers);

          const { meta } = paginate(
            formattedUser.users,
            1, // Only 1 result for exact match
            pagination,
          );

          return { data: formattedUser.users, pageToken: undefined, meta };
        }
      } catch (e) {
        // If exact match fails, fall through to normal pagination
      }
    }

    // When sorting OR searching, fetch ALL users to sort/filter the complete dataset
    let allFirebaseUsers;
    if (sort || searchQuery) {
      // Fetch ALL users by following pagination tokens
      let allUsers = [];
      let pageToken = undefined;
      do {
        const result = await strapi.firebase.auth().listUsers(1000, pageToken);
        allUsers.push(...result.users);
        pageToken = result.pageToken;
      } while (pageToken);

      allFirebaseUsers = { users: allUsers };
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

    // Apply search filter if provided (partial matching across all fields)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      sortedUsers = sortedUsers.filter((user) => {
        return (
          user.uid?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.phoneNumber?.includes(searchQuery) ||
          user.displayName?.toLowerCase().includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower) ||
          user.firstName?.toLowerCase().includes(searchLower) ||
          user.lastName?.toLowerCase().includes(searchLower) ||
          user.strapiId?.toString().includes(searchQuery)
        );
      });
    }

    if (sort) {
      const [sortField, sortOrder] = sort.split(':');

      sortedUsers = [...sortedUsers].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Special handling for createdAt and lastSignInTime - use Firebase metadata
        if (sortField === 'createdAt') {
          aValue = aValue || a.metadata?.creationTime;
          bValue = bValue || b.metadata?.creationTime;
        } else if (sortField === 'lastSignInTime') {
          // For Last Sign In, only use Firebase metadata (no fallback to Strapi updatedAt)
          aValue = a.metadata?.lastSignInTime;
          bValue = b.metadata?.lastSignInTime;
        }

        // Handle null/undefined values - push them to the end
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        // For date fields (createdAt, lastSignInTime), parse as dates
        if (sortField === 'createdAt' || sortField === 'lastSignInTime') {
          const aDate = new Date(aValue).getTime();
          const bDate = new Date(bValue).getTime();
          return sortOrder === 'DESC' ? bDate - aDate : aDate - bDate;
        }

        // For numeric fields, use numeric comparison
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'DESC' ? bValue - aValue : aValue - bValue;
        }

        // For string fields, use locale comparison
        const comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());

        return sortOrder === 'DESC' ? -comparison : comparison;
      });
    }

    // Apply pagination after sorting/filtering - ensure page is at least 1
    if (sort || searchQuery) {
      const page = pagination.page || 1;
      const pageSize = parseInt(pagination.pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      paginatedData = sortedUsers.slice(startIndex, endIndex);
    }

    const { meta } = paginate(
      sort || searchQuery ? sortedUsers : allFirebaseUsers.users,
      sort || searchQuery ? sortedUsers.length : totalUserscount.users.length,
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
