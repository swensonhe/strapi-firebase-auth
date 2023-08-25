import { User } from "../../../../../model/User";
import { Query } from "../../../../../model/Request";
import { getFetchClient } from "@strapi/helper-plugin";
import pluginId from "../../../pluginId";

const fetchStrapiUserById = async (userId: string) => {
  const url = `/${pluginId}/users/${userId}`;

  try {
    const { get } = getFetchClient();
    const { data: user } = await get(url);
    return user;
  } catch (e) {
    return [];
  }
};

const fetchStrapiUsers = async (query: Query = {}) => {
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

const fetchUsers = async (query: Query = {}) => {
  const HOST = process.env.STRAPI_ADMIN_BACKEND_URL;
  console.log("host", HOST);

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

const createUser = async (userPayload: User) => {
  const url = `${pluginId}/users`;
  try {
    const { post } = getFetchClient();
    const { data: user } = await post(url, userPayload);
    return user;
  } catch (e) {
    return null;
  }
};

/**
 * @description Fetch single user
 * @param {String} userID
 * @returns {Object} user
 */

const fetchUserByID = async (userID: string) => {
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

const deleteUser = async (idToDelete: string, destination: string | null) => {
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

const updateUser = async (idToUpdate: string, payload: User) => {
  const url = `${pluginId}/users/${idToUpdate}`;
  const { put } = getFetchClient();
  const { data: user } = await put(url, payload);

  return user;
};

const resetUserPassword = async (
  idToUpdate: string,
  payload: { password: string },
) => {
  const url = `${pluginId}/users/resetPassword/${idToUpdate}`;
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
  resetUserPassword,
};
