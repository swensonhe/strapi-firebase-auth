export default (policyContext, config, { strapi }) => {
  if (policyContext.state?.user?.role?.name === "Administrator") {
    // Go to next policy or will reach the controller's action.
    return true;
  }

  return false;
};

// async (policyContext) => {
//   const headers = policyContext.request.headers;
//   // const currentUser = policyContext.state.user;
//   // const { id: userID } = currentUser;

//   // if (currentUser.role.name !== "Authenticated") {
//   //   return false;
//   // }

//   const { token } = await strapi.entityService.findOne(
//     "plugin::firebase-auth.firebase-auth-configuration",
//     1,
//   );
//   return false;
//   if (!token) return false;
//   policyContext.request.headers = {
//     ...headers,
//     authorization: `Bearer ${token}`,
//   };

//   return true;
// };
