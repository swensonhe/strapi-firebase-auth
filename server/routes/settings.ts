export default [
  {
    method: "GET",
    path: "/settings",
    handler: "settingsController.getToken",
    config: { policies: [] },
  },
  {
    method: "POST",
    path: "/settings",
    handler: "settingsController.setToken",
    config: { policies: [] },
  },
];
