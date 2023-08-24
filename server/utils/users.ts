import { StrapiUser } from "../../model/User";

export const formatUserData = (result: any, strapiUsersData: StrapiUser[]) => ({
  ...result,
  users: result?.users?.map((user: any) => {
    const matchedStrapiUser = strapiUsersData.find(
      (strapiUser: StrapiUser) => strapiUser.email === user.email
    );
    if (!matchedStrapiUser) return user;
    return {
      ...user,
      ...matchedStrapiUser,
      strapiId: matchedStrapiUser.id,
      id: user.id,
    };
  }),
});
