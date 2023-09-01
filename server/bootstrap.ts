import { Strapi } from "@strapi/strapi";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async ({ strapi }: { strapi: Strapi | any }) => {
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
  try {
    // bootstrap phase
    await strapi.admin.services.permission.actionProvider.registerMany(
      RBAC_ACTIONS,
    );
    strapi.plugin("firebase-auth").service("settingsService").init();
  } catch (e) {
    console.log("e --> ", e);
  }
};
