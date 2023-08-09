"use strict";
import utils from "@strapi/utils";
const { sanitize } = utils;

export const sanitizeOutput = (user, ctx) => {
  const schema = strapi.getModel("plugin::users-permissions.user");
  const { auth } = ctx.state;
  return sanitize.contentAPI.output(user, schema, { auth });
};

export const getService = name => {
  return strapi.plugin("users-permissions").service(name);
};

/**
 * @description Generate referralCode for users
 * @param {Number} length
 * @returns referralCode
 */

export const generateReferralCode = length => {
  let referralCode = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    referralCode += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return referralCode;
};


