import utils from "@strapi/utils";
import { Context, DefaultContext } from "koa";
import admin, { ServiceAccount } from "firebase-admin";
import checkValidJson from "../utils/check-valid-json";
import CryptoJS from "crypto-js";

const { ValidationError, ApplicationError } = utils.errors;
export default ({ strapi }) => {
  const encryptionKey = strapi
    .plugin("firebase-auth")
    .config("FIREBASE_JSON_ENCRYPTION_KEY");

  return {
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
        const jsonObject = res["firebase_config_json"];
        if (!jsonObject || !jsonObject.firebaseConfigJson) {
          if (strapi.firebase) {
            await strapi.firebase.delete();
          }
          return;
        }
        const firebaseConfigJson = await this.decryptJson(
          encryptionKey,
          jsonObject.firebaseConfigJson,
        );

        const serviceAccount = checkValidJson(firebaseConfigJson);
        if (!serviceAccount) return;
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as ServiceAccount),
        });
        strapi.firebase = admin;
      } catch (error) {
        console.log("bootstrap error -->", error);
      }
    },
    async getFirebaseConfigJson() {
      const key = encryptionKey;
      try {
        const configObject = await strapi.entityService.findMany(
          "plugin::firebase-auth.firebase-auth-configuration",
        );
        const firebaseConfigJsonObj = configObject["firebase_config_json"];
        const hashedJson = firebaseConfigJsonObj["firebaseConfigJson"];

        const firebaseConfigJson = await this.decryptJson(key, hashedJson);

        return { firebaseConfigJson };
      } catch (error) {
        throw new ApplicationError("some thing went wrong", {
          error: error.message,
        });
      }
    },

    async setFirebaseConfigJson(ctx: DefaultContext | Context) {
      try {
        const { body: firebaseConfigJson } = ctx.request;
        const firebaseConfigJsonString = firebaseConfigJson.firebaseConfigJson;

        const hash = await this.encryptJson(
          encryptionKey,
          firebaseConfigJsonString,
        );

        if (!firebaseConfigJson) throw new ValidationError("data is missing");
        const isExist = await strapi.entityService.findMany(
          "plugin::firebase-auth.firebase-auth-configuration",
        );
        let res: any;
        if (!isExist) {
          res = await strapi.entityService.create(
            "plugin::firebase-auth.firebase-auth-configuration",
            {
              data: { "firebase_config_json": { firebaseConfigJson: hash } },
            },
          );
        } else {
          res = await strapi.entityService.update(
            "plugin::firebase-auth.firebase-auth-configuration",
            isExist.id,
            {
              data: {
                "firebase_config_json": { firebaseConfigJson: hash },
              },
            },
          );
        }
        await strapi.plugin("firebase-auth").service("settingsService").init();
        const firebaseConfigHash =
          res["firebase_config_json"].firebaseConfigJson;
        const firebaseConfigJsonValue = await this.decryptJson(
          encryptionKey,
          firebaseConfigHash,
        );
        res["firebase_config_json"].firebaseConfigJson =
          firebaseConfigJsonValue;
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
    async encryptJson(key: string, json: string) {
      const encrypted = CryptoJS.AES.encrypt(json, key).toString();
      return encrypted;
    },
    async decryptJson(key: string, hash: string) {
      const decrypted = CryptoJS.AES.decrypt(hash, key).toString(
        CryptoJS.enc.Utf8,
      );
      return decrypted;
    },
    async restart() {
      strapi.log.info("*".repeat(100));
      strapi.log.info("SERVER IS RESTARTING");
      setImmediate(() => strapi.reload());
      strapi.log.info("*".repeat(100));
    },
  };
};
