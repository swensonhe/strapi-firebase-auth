import { MapProviderToIcon } from "./provider";
import React from "react";

export const formatUserData = (result: any, strapiUsersData: any) => ({
  ...result,
  data: result?.data?.map((user: any) => {
    const matchedStrapiUser = strapiUsersData.find(
      (strapiUser: any) => strapiUser.email === user.email,
    );
    if (!matchedStrapiUser)
      return {
        ...user,
        providers: <MapProviderToIcon providerData={user.providerData} />,
      };
    return {
      ...user,
      strapiId: matchedStrapiUser.id,
      ...matchedStrapiUser,
      id: user.id,
      providers: <MapProviderToIcon providerData={user.providerData} />,
    };
  }),
});
