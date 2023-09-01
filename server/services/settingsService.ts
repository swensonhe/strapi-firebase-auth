import utils from "@strapi/utils";
import { Context, DefaultContext } from "koa";
import admin, { ServiceAccount } from "firebase-admin";
import checkValidJson from "../utils/check-valid-json";

const { ValidationError, ApplicationError } = utils.errors;

export default ({ strapi }) => ({
  async init() {
    try {
      const res = await strapi.entityService.findMany(
        "plugin::firebase-auth.firebase-auth-configuration",
      );
      if (!res) {
        if (strapi.firebase) {
          await strapi.firebase.app().delete();
        }
        return;
      }
      const jsonObject = res["firebase-config-json"];
      if (!jsonObject || !jsonObject.firebaseConfigJson) {
        if (strapi.firebase) {
          await strapi.firebase.delete();
        }
        return;
      };
      const serviceAccount = checkValidJson(jsonObject.firebaseConfigJson);
      if (!serviceAccount) return;
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
      });
      strapi.firebase = admin;
    } catch (error) {
      console.log("bootstrap error", error);
    }
  },
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
      let res: any;
      if (!isExist) {
        res = await strapi.entityService.create(
          "plugin::firebase-auth.firebase-auth-configuration",
          {
            data: { "firebase-config-json": firebaseConfigJson },
          },
        );
      } else {
        res = await strapi.entityService.update(
          "plugin::firebase-auth.firebase-auth-configuration",
          isExist.id,
          {
            data: {
              "firebase-config-json": firebaseConfigJson,
            },
          },
        );
      }
      await strapi.plugin("firebase-auth").service("settingsService").init();
      return res;
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
      const res = await strapi.entityService.delete(
        "plugin::firebase-auth.firebase-auth-configuration",
        isExist.id,
      );
      await strapi.plugin("firebase-auth").service("settingsService").init();
      return res;
    } catch (error) {
      throw new ApplicationError("some thing went wrong", {
        error: error,
      });
    }
  },
  async restart() {
    console.log("*".repeat(100));
    console.log("SERVER IS RESTARTING");
    setImmediate(() => strapi.reload());
    console.log("*".repeat(100));
  },
});
