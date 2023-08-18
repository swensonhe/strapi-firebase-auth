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
      const x = await strapi.entityService.create(
        "plugin::firebase-auth.firebase-auth-configuration",
        {
          data: { token },
        },
      );
      console.log("xxx", x);
    } catch (error) {
      console.log("error", error);
    }
  },
};
