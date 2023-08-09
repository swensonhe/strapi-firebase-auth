import { processMeData } from "./fetch-me";
import  utils from "@strapi/utils";
const { ValidationError, NotFoundError } = utils.errors;

import  { NO_DESTINATION_ID, USER_NOT_FOUND } from "../constants/errors";

/*
 * @description Fetch `users-permissions` user by ID
 * @param {Number} userID
 * @returns userObject
 */
export default async userID => {
  if (!userID) {
    throw new ValidationError(NO_DESTINATION_ID);
  }
  const candidateUser = await strapi.db.query("plugin::users-permissions.user").findOne({
    where: {
      id: userID,
    },
  });
  if (!candidateUser) {
    throw new NotFoundError(`${USER_NOT_FOUND} ${userID}`);
  }
  return processMeData(candidateUser);
};
