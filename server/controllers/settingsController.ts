import { Strapi } from "@strapi/strapi";
declare const strapi: Strapi;
export default {
  getToken: async () => {
    const { token } = await strapi.entityService.findOne(
      "plugin::firebase-auth.",
      1,
    );
    return token;
  },
  setToken: async (ctx) => {
    try {
      const { token } = ctx.request.body;
      console.log("token", token);
      const isExist = await strapi.entityService.findOne(
        "plugin::firebase-auth.firebase-auth-configuration",
        1,
      );
      if (!isExist) {
        ctx.body = await strapi.entityService.create(
          "plugin::firebase-auth.firebase-auth-configuration",
          {
            data: { token },
          },
        );
      } else {
        ctx.body = await strapi.entityService.update(
          "plugin::firebase-auth.firebase-auth-configuration",
          1,
          {
            data: {
              token,
              "firebase-config-json": isExist["firebase-config-json"],
            },
          },
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  },
};
