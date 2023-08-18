import settings from "./settings";

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
    {
      method: "GET",
      path: "/users",
      handler: "userController.list",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/users",
      handler: "userController.create",
      config: {
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/users",
      handler: "userController.deleteMany",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/users/:id",
      handler: "userController.get",
      config: {
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/users/:id",
      handler: "userController.update",
      config: {
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/users/:id",
      handler: "userController.delete",
      config: {
        policies: [],
      },
    },
    ...settings,
  ],
};
