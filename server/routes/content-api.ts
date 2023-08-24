export default {
  type: "content-api",
  routes: [
    {
      method: "POST",
      path: "/",
      handler: "firebaseController.validateToken",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/override",
      handler: "firebaseController.overrideAccess",
      config: {
        policies: [],
      },
    },
  ],
};
