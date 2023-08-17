import { Strapi } from "@strapi/strapi";
declare const strapi: Strapi;
export default {
  getToken: async () => {
    const { DASHBOARD_API_TOKEN } = await strapi.entityService.findOne(
      "plugin::firebase-auth.settings",
      1,
    );
    return DASHBOARD_API_TOKEN;
  },
  setToken: async ({ DASHBOARD_API_TOKEN }) => {
    await strapi.entityService.create("plugin::firebase-auth.settings", {
      data: DASHBOARD_API_TOKEN,
    });
  },
};
