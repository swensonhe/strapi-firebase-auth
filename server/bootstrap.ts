import { Strapi } from "@strapi/strapi";
import admin, { ServiceAccount } from "firebase-admin";

import checkValidJson from "./utils/check-valid-json";

const RBAC_ACTIONS = [
  {
    section: "plugins",
    displayName: "Access firebase Auth Configurations",
    uid: "is-admin",
    pluginName: "firebase-auth",
  },
  {
    section: "settings",
    category: "Firebase Auth",
    displayName: "Firebase Auth: Read",
    uid: "settings.read",
    pluginName: "firebase-auth",
  },
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async ({ strapi }: { strapi: Strapi | any }) => {
  try {
    // bootstrap phase
    await strapi.admin.services.permission.actionProvider.registerMany(
      RBAC_ACTIONS,
    );

    // get firebase configs json from db
    const res = await strapi.entityService.findMany(
      "plugin::firebase-auth.firebase-auth-configuration",
    );

    const jsonObject = res["firebase-config-json"];

    if (!jsonObject || !jsonObject.firebaseConfigJson) return;
    const serviceAccount = checkValidJson(jsonObject.firebaseConfigJson);

    if (!serviceAccount) return;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });

    strapi.firebase = admin;
  } catch (error) {
    console.log("bootstrap error", error);
  }
};
