import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { LoadingIndicatorPage, useNotification } from "@strapi/helper-plugin";
import { Layout } from "@strapi/design-system";
import { Main } from "@strapi/design-system";
import { Box } from "@strapi/design-system";
import {
  Grid,
  GridItem,
  Typography,
  Button,
  Flex,
} from "@strapi/design-system";
import { useQuery } from "react-query";
import { fetchUsers } from "./utils/api";
import ListView from "../ListView";
import { User } from "../../../../model/User";
import { ResponseMeta } from "../../../../model/Meta";
import { ExclamationMarkCircle } from "@strapi/icons";
import { useHistory } from "react-router-dom";
import { getFirebaseConfig } from "../Settings/api";

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
  const [isNotConfigured, setIsNotConfigured] = useState(false);
  const [isLoadingConfiguration, setIsLoadingConfiguration] = useState(true);

  const history = useHistory();

  const handleRetrieveFirebaseJsonConfig = () => {
    getFirebaseConfig()
      .then(() => {
        setIsNotConfigured(false);
        setIsLoadingConfiguration(false);
      })
      .catch((err) => {
        setIsNotConfigured(true);
        setIsLoadingConfiguration(false);
        console.log(err);
      });
  };

  useEffect(() => {
    handleRetrieveFirebaseJsonConfig();
  }, []);

  const { isLoading } = useQuery("firebase-auth-", () => fetchUsers(), {
    onSuccess: (result) => {
      setUsersData(result);
    },

    onError: (err: any) => {
      console.log(err);
      toggleNotification({
        type: "warning",
        message: {
          id: "notification.error",
          defaultMessage: "An error occured",
        },
      });
    },
    enabled: !isLoadingConfiguration && !isNotConfigured,
  });

  if (isLoading || isLoadingConfiguration) {
    return <LoadingIndicatorPage />;
  }

  return (
    <Layout>
      <Helmet title="Firebase Users" />
      <Main>
        <Box padding={10}>
          {!isNotConfigured ? (
            <Grid gap={4}>
              <GridItem col={12} s={12}>
                <ListView data={usersData.data} meta={usersData.meta} />
              </GridItem>
            </Grid>
          ) : (
            <Flex direction="column" marginTop={10}>
              <ExclamationMarkCircle />
              <Box marginTop={1}>
                <Typography>
                  Firebase is not configured, please configure Firebase
                </Typography>
              </Box>
              <Button
                marginTop={3}
                onClick={() => {
                  history.push("/settings/firebase-auth");
                }}
              >
                Configure firebase
              </Button>
            </Flex>
          )}
        </Box>
      </Main>
    </Layout>
  );
};
