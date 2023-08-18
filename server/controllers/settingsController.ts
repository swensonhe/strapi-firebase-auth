import { Strapi } from "@strapi/strapi";
import { Context, DefaultContext } from "koa";

declare const strapi: Strapi;
export default {
  getToken: async (ctx: DefaultContext | Context) => {
    ctx.body = await strapi
      .plugin("firebase-auth")
      .service("settingsService")
      .getToken(ctx);
  },

  setToken: async (ctx: DefaultContext | Context) => {
    ctx.body = await strapi
      .plugin("firebase-auth")
      .service("settingsService")
      .setToken(ctx);
  },
  setFirebaseConfigJson: async (ctx: DefaultContext | Context) => {
    ctx.body = await strapi
      .plugin("firebase-auth")
      .service("settingsService")
      .setFirebaseConfigJson(ctx);
  },
};
