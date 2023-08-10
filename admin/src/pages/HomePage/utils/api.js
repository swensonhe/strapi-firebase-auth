import axios from "axios";

/**
 * @description Fetch users
 * @returns {Object} users
 */

const CUSTOM_VARIABLES = {
  dashboardApiToken:
    "b121410296f6d3822c71763558d43430ba1bb7352bc8ebd8339697ade537bdfec95b8f10910ecc96c827c826227c532a2c083dde0bdfa581993924382b055067af7250ce5f4c92b03a9abfb3f5dbb54f66c33d24151768917e05149f6891432142c1273046dd7837e1694c8c52898c21f503f487a87582c06c3e5e86a6282f6b",
};

const fetchUsers = async (query = {}) => {
  const HOST = process.env.STRAPI_ADMIN_BACKEND_URL;

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
    console.log("beforeee", url);
    const { data: users } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${CUSTOM_VARIABLES.dashboardApiToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log("usersss", users);
    return users;
  } catch (e) {
    console.log("errorrr", e);
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

const deleteUser = async (idToDelete) => {
  const HOST = process.env.STRAPI_ADMIN_BACKEND_URL;
  try {
    const { data: users } = await axios.delete(
      `${HOST}/api/firebase-auth/users/${idToDelete}`,
      {
        headers: {
          Authorization: `Bearer ${CUSTOM_VARIABLES.dashboardApiToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    console.log(users.data);
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

export { fetchUsers, fetchUserByID, deleteUser, updateUser, createUser };
