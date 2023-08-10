import { Strapi } from "@strapi/strapi";
import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../keys/andrew-golf-firebase-adminsdk-5p9ia-9c1238b1f5.json";

const RBAC_ACTIONS = [
  {
    section: "plugins",
    displayName: "Firebase-Auth read",
    uid: "read",
    pluginName: "firebase-auth",
  },
];
export default async ({ strapi }: { strapi: Strapi | any }) => {
  // bootstrap phase
  await strapi.admin.services.permission.actionProvider.registerMany(
    RBAC_ACTIONS
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });

  strapi.firebase = admin;
};
