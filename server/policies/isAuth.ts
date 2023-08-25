export default (policyContext, config, { strapi }) => {
  console.log("policyContext.state", policyContext.state.user);
  if (policyContext.state?.user?.role?.name === "Administrator") {
    // Go to next policy or will reach the controller's action.
    return true;
  }

  return false;
};

// async (policyContext) => {
//   const headers = policyContext.request.headers;
//   console.log("token", headers);
//   // const currentUser = policyContext.state.user;
//   // console.log("currentUser", currentUser);
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

//   console.log("token", token);
//   return true;
// };
