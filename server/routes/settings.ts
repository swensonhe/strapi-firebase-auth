export default [
  {
    method: "GET",
    path: "/settings",
    handler: "settings.getToken",
    config: { policies: [] },
  },
  {
    method: "POST",
    path: "/settings",
    handler: "settings.setToken",
    config: { policies: [] },
  },
];
