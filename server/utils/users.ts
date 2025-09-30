import { StrapiUser } from "../../model/User";

export const formatUserData = (result: any, strapiUsersData: StrapiUser[]) => ({
  ...result,
  users: result?.users?.map((user: any) => {
    // Try to match by firebaseUserId first (primary key), then fall back to email or phone number
    const matchedStrapiUser = strapiUsersData.find(
      (strapiUser: StrapiUser) =>
        strapiUser.firebaseUserId === user.uid ||
        (user.email && strapiUser.email === user.email) ||
        (user.phoneNumber && strapiUser.phoneNumber === user.phoneNumber)
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
