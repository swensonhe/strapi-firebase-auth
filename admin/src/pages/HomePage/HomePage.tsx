import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { LoadingIndicatorPage, useNotification } from "@strapi/helper-plugin";
import { Layout } from "@strapi/design-system";
import { Main } from "@strapi/design-system";
import { Box } from "@strapi/design-system";
import { Grid, GridItem } from "@strapi/design-system";
import { useQuery } from "react-query";
import { fetchUsers } from "./utils/api";
import ListView from "../ListView";
import { User } from "../../../../model/User";
import { ResponseMeta } from "../../../../model/Meta";

const INITIAL_USERS_DATA = {
  data: [],
  meta: { pagination: { page: 0, pageCount: 0, pageSize: 0, total: 0 } },
};

export const HomePage = () => {
  const toggleNotification = useNotification();
  const [usersData, setUsersData] = useState<{
    data: User[];
    meta: ResponseMeta;
  }>(INITIAL_USERS_DATA);

  const { status } = useQuery("firebase-auth-", () => fetchUsers(), {
    onSuccess: (result) => {
      setUsersData(result);
    },

    onError: () => {
      toggleNotification({
        type: "warning",
        message: {
          id: "notification.error",
          defaultMessage: "An error occured",
        },
      });
    },
  });
  const isLoadingUsersData = status !== "success" && status !== "error";

  if (isLoadingUsersData) {
    return <LoadingIndicatorPage />;
  }

  return (
    <Layout>
      <Helmet title="Firebase Users" />
      <Main>
        <Box padding={10}>
          <Grid gap={4}>
            <GridItem col={12} s={12}>
              <>
                <ListView data={usersData.data} meta={usersData.meta} />
              </>
            </GridItem>
          </Grid>
        </Box>
      </Main>
    </Layout>
  );
};
