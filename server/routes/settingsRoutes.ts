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
];
