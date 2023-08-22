export const formatUserData = (result: any, strapiUsersData: any) => ({
  ...result,
  users: result?.users?.map((user: any) => {
    const matchedStrapiUser = strapiUsersData.find(
      (strapiUser: any) => strapiUser.email === user.email
    );
    if (!matchedStrapiUser) return user;
    return {
      ...user,
      strapiId: matchedStrapiUser.id,
      ...matchedStrapiUser,
      id: user.id,
    };
  }),
});
