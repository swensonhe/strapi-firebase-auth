import utils from "@strapi/utils";
import { Context, DefaultContext } from "koa";
const { ValidationError, ApplicationError } = utils.errors;

export default ({ strapi }) => ({
  getToken: async () => {
    const { token } = await strapi.entityService.findOne(
      "plugin::firebase-auth.firebase-auth-configuration",
      1,
    );
    return token;
  },
  setToken: async (ctx: DefaultContext | Context) => {
    try {
      const { token } = ctx.request.body;
      if (!token) throw new ValidationError("data is missing");
      console.log("token", token);
      const isExist = await strapi.entityService.findOne(
        "plugin::firebase-auth.firebase-auth-configuration",
        1,
      );
      if (!isExist) {
        return strapi.entityService.create(
          "plugin::firebase-auth.firebase-auth-configuration",
          {
            data: { token },
          },
        );
      } else {
        return strapi.entityService.update(
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
  setFirebaseConfigJson: async (ctx: DefaultContext | Context) => {
    try {
      const { body: firebaseConfigJson } = ctx.request;
      console.log("token", ctx.request.body);
      if (!firebaseConfigJson) throw new ValidationError("data is missing");
      const isExist = await strapi.entityService.findOne(
        "plugin::firebase-auth.firebase-auth-configuration",
        1,
      );
      if (!isExist) {
        return strapi.entityService.create(
          "plugin::firebase-auth.firebase-auth-configuration",
          {
            data: { "firebase-config-json": firebaseConfigJson },
          },
        );
      } else {
        return strapi.entityService.update(
          "plugin::firebase-auth.firebase-auth-configuration",
          1,
          {
            data: {
              token: isExist.token,
              "firebase-config-json": firebaseConfigJson,
            },
          },
        );
      }
    } catch (error) {
      console.log("error", error);
      throw new ApplicationError("some thing went wrong", {
        error: error.message,
      });
    }
  },
});
