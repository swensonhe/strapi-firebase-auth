import axios from "axios";

/**
 * @description Fetch users
 * @returns {Object} users
 */

const fetchStrapiUserById = async (userId) => {
  const HOST = process.env.STRAPI_ADMIN_BACKEND_URL;

  const url = `${HOST}/api/users/${userId}`;

  try {
    const { data: user } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${CUSTOM_VARIABLES.dashboardApiToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return user;
  } catch (e) {
    return [];
  }
};

const fetchStrapiUsers = async (query = {}) => {
  const HOST = process.env.STRAPI_ADMIN_BACKEND_URL;

  if (!query.page) {
    query.page = 1;
  }

  if (!query.pageSize) {
    query.pageSize = 10;
  }

  let url = `${HOST}/api/users?pagination[page]=${query.page}&pagination[pageSize]=${query.pageSize}`;

  if (query.nextPageToken) {
    url += `&nextPageToken=${query.nextPageToken}`;
  }

  try {
    const { data: users } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${CUSTOM_VARIABLES.dashboardApiToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return users;
  } catch (e) {
    return [];
  }
};

const fetchUsers = async (query = {}) => {
  const HOST = process.env.STRAPI_ADMIN_BACKEND_URL;
  console.log("host", HOST);

  if (!query.page) {
    query.page = 1;
  }

  if (!query.pageSize) {
    query.pageSize = 10;
  }

  let url = `${HOST}/api/firebase-auth/users?pagination[page]=${query.page}&pagination[pageSize]=${query.pageSize}`;

  if (query.nextPageToken) {
    url += `&nextPageToken=${query.nextPageToken}`;
  }

  try {
    const { data: users } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${CUSTOM_VARIABLES.dashboardApiToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return users;
  } catch (e) {
    return [];
  }
};

/**
 * @description Create firebase user
 * @param {Object} userPayload
 * @returns {Object} user
 */

const createUser = async (userPayload) => {
  const HOST = process.env.STRAPI_ADMIN_BACKEND_URL;
  try {
    const { data: user } = await axios.post(
      `${HOST}/api/firebase-auth/users`,
      userPayload,
      {
        headers: {
          Authorization: `Bearer ${CUSTOM_VARIABLES.dashboardApiToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return user;
  } catch (e) {
    return [];
  }
};

/**
 * @description Fetch single user
 * @param {String} userID
 * @returns {Object} user
 */

const fetchUserByID = async (userID) => {
  const HOST = process.env.STRAPI_ADMIN_BACKEND_URL;
  try {
    const { data: user } = await axios.get(
      `${HOST}/api/firebase-auth/users/${userID}`,
      {
        headers: {
          Authorization: `Bearer ${CUSTOM_VARIABLES.dashboardApiToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return user;
  } catch (e) {
    return [];
  }
};

/**
 * @description Delete user by id
 * @param {String} idToDelete
 * @returns {Object} user
 */

const deleteUser = async (idToDelete, destination) => {
  console.log("idToDelete", idToDelete);
  const HOST = process.env.STRAPI_ADMIN_BACKEND_URL;
  try {
    const { data: users } = await axios.delete(
      `${HOST}/api/firebase-auth/users/${idToDelete}${
        destination ? `?destination=${destination}` : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${CUSTOM_VARIABLES.dashboardApiToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return users.data;
  } catch (e) {
    return {};
  }
};

/**
 * @description Update user by id
 * @param {String} idToUpdate
 * @param {Object} payload
 * @returns {Object} user
 */

const updateUser = async (idToUpdate, payload) => {
  const HOST = process.env.STRAPI_ADMIN_BACKEND_URL;
  const { data: user } = await axios.patch(
    `${HOST}/api/firebase-auth/users/${idToUpdate}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${CUSTOM_VARIABLES.dashboardApiToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  return user;
};

export {
  fetchUsers,
  fetchUserByID,
  deleteUser,
  updateUser,
  createUser,
  fetchStrapiUsers,
  fetchStrapiUserById,
};
