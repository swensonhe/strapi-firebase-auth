import utils from "@strapi/utils";
import { Context, DefaultContext } from "koa";
const { ValidationError, ApplicationError } = utils.errors;

export default ({ strapi }) => ({
  getFirebaseConfigJson: async () => {
    try {
      const config = await strapi.entityService.findOne(
        "plugin::firebase-auth.firebase-auth-configuration",
        1,
      );
      if (!config || !config["firebase-config-json"]) {
        throw new ApplicationError("some thing went wrong", {
          error: "no firebase config Found",
        });
      }
      return config["firebase-config-json"];
    } catch (error) {
      throw new ApplicationError("some thing went wrong", {
        error: error.message,
      });
    }
  },

  setFirebaseConfigJson: async (ctx: DefaultContext | Context) => {
    try {
      const { body: firebaseConfigJson } = ctx.request;
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
      throw new ApplicationError("some thing went wrong", {
        error: error.message,
      });
    }
  },
  delFirebaseConfigJson: async () => {
    try {
      const isExist = await strapi.entityService.findOne(
        "plugin::firebase-auth.firebase-auth-configuration",
        1,
      );
      if (!isExist) {
        throw new ValidationError("The Firebase configs not exist");
      }
      return strapi.entityService.delete(
        "plugin::firebase-auth.firebase-auth-configuration",
      );
    } catch (error) {
      throw new ApplicationError("some thing went wrong", {
        error: error.message,
      });
    }
  },
});
