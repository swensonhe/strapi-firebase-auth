import React, { useState } from "react";
import { Stack } from "@strapi/design-system/Stack";
import { Main } from "@strapi/design-system/Main";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import { ContentLayout } from "@strapi/design-system/Layout";
import { Box } from "@strapi/design-system/Box";
import { TextInput } from "@strapi/design-system/TextInput";
import { Link } from "@strapi/design-system/Link";
import Header from "./Header";
import { ToggleInput } from "@strapi/design-system/ToggleInput";
import { LoadingIndicatorPage, useNotification } from "@strapi/helper-plugin";
import { Divider } from "@strapi/design-system/Divider";
import Pencil from "@strapi/icons/Pencil";
import { Typography } from "@strapi/design-system/Typography";
import styled from "styled-components";
import { format } from "date-fns";
import { updateUser } from "../HomePage/utils/api";
import { Flex } from "@strapi/design-system/Flex";

const USERS_URL =
  "/content-manager/collectionType/plugin::users-permissions.user";

const ContentWrapper = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  padding: 5px;
`;

const DetailsButtonWrapper = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 5px;
`;

const MetaWrapper = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 18px;
  padding: 5px;
`;

const EditForm = ({ data }) => {
  const [userData, setUserData] = useState(data);
  const [originalUserData, setOriginalUserData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const toggleNotification = useNotification();

  const onTextInputChange = (e) => {
    e.preventDefault();
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onToggleInputChange = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.checked,
    }));
  };

  const updateUserHandler = async () => {
    setIsLoading(true);
    try {
      const updatedUser = await updateUser(userData.uid, userData);
      setUserData(() => updatedUser);
      setOriginalUserData(() => updatedUser);
      setIsLoading(false);
      toggleNotification({
        type: "success",
        message: { id: "notification.success", defaultMessage: "Saved" },
      });
    } catch (e) {
      console.log("err --> ", e);
      toggleNotification({
        type: "warning",
        message: {
          id: "notification.error",
          defaultMessage: "An error occured!",
        },
      });
      setIsLoading(false);
      setUserData(() => data);
    }
  };

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  return (
    <Main>
      <Header
        title="Edit User"
        onSave={updateUserHandler}
        initialData={originalUserData}
        modifiedData={userData}
      />
      <ContentLayout>
        <Grid gap={4}>
          <GridItem col={9} s={12}>
            <Box background="neutral0" borderColor="neutral150" hasRadius>
              <Stack spacing={2} padding={3} gap={2}>
                <TextInput
                  id="displayName"
                  name="displayName"
                  autoComplete="new-password"
                  onChange={onTextInputChange}
                  label="Display Name"
                  value={userData.displayName}
                />
                <TextInput
                  id="email"
                  name="email"
                  autoComplete="new-password"
                  onChange={onTextInputChange}
                  label="Email"
                  value={userData.email}
                />
                <TextInput
                  id="phoneNumber"
                  name="phoneNumber"
                  autoComplete="new-password"
                  onChange={onTextInputChange}
                  label="Phone Number"
                  value={userData.phoneNumber}
                />
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  onChange={onTextInputChange}
                  label="Password"
                  value={userData.password}
                />
                <ToggleInput
                  label="Disabled"
                  name="disabled"
                  onLabel="True"
                  offLabel="False"
                  checked={Boolean(userData.disabled)}
                  onChange={onToggleInputChange}
                />
                <ToggleInput
                  label="Email Verified"
                  name="emailVerified"
                  onLabel="True"
                  offLabel="False"
                  checked={Boolean(userData.emailVerified)}
                  onChange={onToggleInputChange}
                />
              </Stack>
            </Box>
          </GridItem>
          <GridItem col={3} s={12}>
            <Box
              as="aside"
              aria-labelledby="additional-informations"
              background="neutral0"
              borderColor="neutral150"
              hasRadius
              paddingBottom={2}
              paddingLeft={4}
              paddingRight={4}
              paddingTop={2}
              shadow="tableShadow"
            >
              {userData.providerData.map((provider) => {
                return (
                  <Flex
                    paddingTop={2}
                    paddingBottom={2}
                    direction="column"
                    alignItems="flex-start"
                    gap={2}
                  >
                    <Flex gap={1}>
                      <Typography
                        variant="sigma"
                        textColor="neutral600"
                        id="relations-title"
                      >
                        Provider Id:
                      </Typography>
                      <Typography
                        variant="sigma"
                        textColor="neutral600"
                        id="relations-title"
                      >
                        {provider.providerId}
                      </Typography>
                    </Flex>
                    <Flex gap={1}>
                      <Typography
                        variant="sigma"
                        textColor="neutral600"
                        id="relations-title"
                      >
                        UID:
                      </Typography>
                      <Typography
                        variant="sigma"
                        textColor="neutral600"
                        id="relations-title"
                      >
                        {provider.uid}
                      </Typography>
                    </Flex>
                  </Flex>
                );
              })}
              <Divider />
              <Flex
                paddingTop={2}
                paddingBottom={2}
                direction="column"
                alignItems="flex-start"
              >
                {userData.metadata.lastSignInTime && (
                  <MetaWrapper>
                    <Typography
                      variant="sigma"
                      textColor="neutral600"
                      id="relations-title"
                    >
                      Last Sign In Time
                    </Typography>
                    <Typography
                      variant="sigma"
                      textColor="neutral600"
                      id="relations-title"
                    >
                      {format(
                        new Date(userData.metadata.lastSignInTime),
                        "yyyy/MM/dd kk:mm"
                      )}
                    </Typography>
                  </MetaWrapper>
                )}
                <MetaWrapper>
                  <Typography
                    variant="sigma"
                    textColor="neutral600"
                    id="relations-title"
                  >
                    Creation Time
                  </Typography>
                  <Typography
                    variant="sigma"
                    textColor="neutral600"
                    id="relations-title"
                  >
                    {format(
                      new Date(userData.metadata.creationTime),
                      "yyyy/MM/dd kk:mm"
                    )}
                  </Typography>
                </MetaWrapper>
              </Flex>
            </Box>
            <Box marginTop={5} marginBottom={5} />
            {userData.localUser && (
              <Box
                as="aside"
                aria-labelledby="additional-informations"
                background="neutral0"
                borderColor="neutral150"
                hasRadius
                paddingBottom={1}
                paddingLeft={2}
                paddingRight={2}
                paddingTop={1}
                shadow="tableShadow"
              >
                <Box paddingTop={2} paddingBottom={2}>
                  <DetailsButtonWrapper>
                    <Link
                      size="S"
                      startIcon={<Pencil />}
                      to={`${USERS_URL}/${userData.localUser.id}`}
                    >
                      Details
                    </Link>
                  </DetailsButtonWrapper>
                  <ContentWrapper label="UID">
                    <Typography
                      variant="sigma"
                      textColor="neutral600"
                      id="relations-title"
                    >
                      local user:
                    </Typography>
                    <Typography
                      variant="sigma"
                      textColor="neutral600"
                      id="relations-title"
                    >
                      {userData.localUser.username}
                    </Typography>
                  </ContentWrapper>
                </Box>
              </Box>
            )}
          </GridItem>
        </Grid>
      </ContentLayout>
      <Box>
        <ContentLayout marginTop={8}>
          <Grid gap={4}>
            <GridItem col={9} s={12}>
              <Box background="neutral0" borderColor="neutral150" hasRadius>
                <Stack spacing={2} padding={3} gap={2}></Stack>
              </Box>
            </GridItem>
          </Grid>
        </ContentLayout>
      </Box>
    </Main>
  );
};

export default EditForm;
