export default [
  {
    method: "GET",
    path: "/settings/token",
    handler: "settingsController.getToken",
    config: { policies: [] },
  },
  {
    method: "POST",
    path: "/settings/token",
    handler: "settingsController.setToken",
    config: { policies: [] },
  },
  {
    method: "POST",
    path: "/settings/firebase-config",
    handler: "settingsController.setFirebaseConfigJson",
    config: { policies: [] },
  },
  {
    method: "GET",
    path: "/settings/firebase-config",
    handler: "settingsController.getFirebaseConfigJson",
    config: { policies: [] },
  },
  {
    method: "DELETE",
    path: "/settings/firebase-config",
    handler: "settingsController.delFirebaseConfigJson",
    config: { policies: [] },
  },
  {
    method: "POST",
    path: "/settings/restart",
    handler: "settingsController.restart",
    config: { policies: [] },
  },
];
