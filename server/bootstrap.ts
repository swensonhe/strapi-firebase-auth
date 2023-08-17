import { Strapi } from "@strapi/strapi";
import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../keys/andrew-golf-firebase-adminsdk-5p9ia-9c1238b1f5.json";

const RBAC_ACTIONS = [
  {
    section: "plugins",
    displayName: "firebase Auth settings",
    uid: "settings",
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
