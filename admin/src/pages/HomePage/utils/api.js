import { getFetchClient } from "@strapi/helper-plugin";
import pluginId from "../../../pluginId";

/**
 * @description Fetch users
 * @returns {Object} users
 */

const fetchStrapiUserById = async (userId) => {
  const url = `/${pluginId}/users/${userId}`;

  try {
    const { get } = getFetchClient();
    const { data: user } = await get(url);
    return user;
  } catch (e) {
    return [];
  }
};

const fetchStrapiUsers = async (query = {}) => {
  if (!query.page) {
    query.page = 1;
  }

  if (!query.pageSize) {
    query.pageSize = 10;
  }

  let url = `/${pluginId}/users?pagination[page]=${query.page}&pagination[pageSize]=${query.pageSize}`;

  if (query.nextPageToken) {
    url += `&nextPageToken=${query.nextPageToken}`;
  }

  try {
    const { get } = getFetchClient();
    const { data: users } = await get(url);

    return users;
  } catch (e) {
    return [];
  }
};
// console.log("auth.getToken()", auth.getToken());
const fetchUsers = async (query = {}) => {
  if (!query.page) {
    query.page = 1;
  }

  if (!query.pageSize) {
    query.pageSize = 10;
  }

  let url = `/${pluginId}/users?pagination[page]=${query.page}&pagination[pageSize]=${query.pageSize}`;

  if (query.nextPageToken) {
    url += `&nextPageToken=${query.nextPageToken}`;
  }

  try {
    const { get } = getFetchClient();
    const { data: users } = await get(url);
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
  const url = `${pluginId}/users`;
  try {
    const { post } = getFetchClient();
    const { data: user } = await post(url, userPayload);
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
  const url = `${pluginId}/users/${userID}`;
  try {
    const { get } = getFetchClient();
    const { data: user } = await get(url);
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
  const url = `${pluginId}/users/${idToDelete}${
    destination ? `?destination=${destination}` : ""
  }`;
  try {
    const { del } = getFetchClient();
    const { data: users } = await del(url);

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
  const url = `${pluginId}/users/${idToUpdate}`;
  const { put } = getFetchClient();
  const { data: user } = await put(url, payload);

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
