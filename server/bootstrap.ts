import { Strapi } from "@strapi/strapi";
import admin, { ServiceAccount } from "firebase-admin";

const RBAC_ACTIONS = [
  {
    section: "plugins",
    displayName: "Access firebase Auth Configurations",
    uid: "is-admin",
    pluginName: "firebase-auth",
  },
  {
    section: "settings",
    category: "firebase-auth",
    displayName: "firebase Auth settings",
    uid: "settings.read",
    pluginName: "firebase-auth",
  },
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async ({ strapi }: { strapi: Strapi | any }) => {
  try {
    const res = await strapi.entityService.findOne(
      "plugin::firebase-auth.firebase-auth-configuration",
      1,
    );

    const jsonObject = res["firebase-config-json"];
    const serviceAccount = JSON.parse(jsonObject.firebaseConfigJson);
    // bootstrap phase
    await strapi.admin.services.permission.actionProvider.registerMany(
      RBAC_ACTIONS,
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });

    strapi.firebase = admin;
  } catch (error) {
    console.log("bootstrap error", error);
  }
};
