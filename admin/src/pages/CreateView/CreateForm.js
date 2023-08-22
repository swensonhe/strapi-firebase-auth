import React, { useState } from "react";
import { Stack } from "@strapi/design-system/Stack";
import { Main } from "@strapi/design-system/Main";
import { ContentLayout } from "@strapi/design-system/Layout";
import { Box } from "@strapi/design-system/Box";
import { TextInput } from "@strapi/design-system/TextInput";
import Header from "./Header";
import { ToggleInput } from "@strapi/design-system/ToggleInput";
import { LoadingIndicatorPage, useNotification } from "@strapi/helper-plugin";
import { useHistory } from "react-router-dom";
import { createUser } from "../HomePage/utils/api";
import { Grid, GridItem } from "@strapi/design-system/Grid";

const CreateForm = () => {
  const [userData, setUserData] = useState({});
  const [originalUserData, setOriginalUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const toggleNotification = useNotification();
  const {
    push,
    location: { pathname },
  } = useHistory();
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
      const createdUser = await createUser(userData);
      console.log({ createdUser });
      setUserData(() => createdUser);
      setOriginalUserData(() => createdUser);
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
      setUserData(() => {});
    }
  };

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  return (
    <Main>
      <Header
        title="Create User"
        onSave={updateUserHandler}
        isCreatingEntry
        initialData={originalUserData}
        modifiedData={userData}
      />
      <ContentLayout>
        <Grid gap={4}>
          <GridItem col={9} s={12}>
            <Box background="neutral0" borderColor="neutral150" hasRadius>
              <Stack spacing={4} padding={3}>
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
                  onChange={onTextInputChange}
                  autoComplete="new-password"
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
        </Grid>
      </ContentLayout>
    </Main>
  );
};

export default CreateForm;
