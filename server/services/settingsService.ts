import utils from "@strapi/utils";
import { Context, DefaultContext } from "koa";
const { ValidationError, ApplicationError } = utils.errors;

export default ({ strapi }) => ({
  getFirebaseConfigJson: async () => {
    try {
      return strapi.entityService.findMany(
        "plugin::firebase-auth.firebase-auth-configuration",
      );
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
      const isExist = await strapi.entityService.findMany(
        "plugin::firebase-auth.firebase-auth-configuration",
      );
      console.log("isExist", isExist);
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
          isExist.id,
          {
            data: {
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
      const isExist = await strapi.entityService.findMany(
        "plugin::firebase-auth.firebase-auth-configuration",
      );
      return strapi.entityService.delete(
        "plugin::firebase-auth.firebase-auth-configuration",
        isExist.id,
      );
    } catch (error) {
      console.log("error", error);
      throw new ApplicationError("some thing went wrong", {
        error: error,
      });
    }
  },
  async restart() {
    setImmediate(() => strapi.reload());
  },
});
