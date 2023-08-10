import React, { memo, useState } from "react";
import { Helmet } from "react-helmet";
import { LoadingIndicatorPage, useNotification } from "@strapi/helper-plugin";
import { Layout } from "@strapi/design-system/Layout";
import { Main } from "@strapi/design-system/Main";
import { Box } from "@strapi/design-system/Box";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import { useQuery } from "react-query";
import { fetchUsers } from "./utils/api";
import ListView from "../ListView";

const HomePage = () => {
  const toggleNotification = useNotification();
  const [usersData, setUsersData] = useState({ data: [], meta: {} });

  const { status } = useQuery("firebase-auth-", () => fetchUsers(), {
    onSuccess: result => {
      setUsersData(result);
    },

    onError: () => {
      toggleNotification({
        type: "warning",
        message: { id: "notification.error", defaultMessage: "An error occured" },
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
                <ListView data={usersData.data} meta={usersData.meta} slug="users-view" />
              </>
            </GridItem>
          </Grid>
        </Box>
      </Main>
    </Layout>
  );
};

export default memo(HomePage);
