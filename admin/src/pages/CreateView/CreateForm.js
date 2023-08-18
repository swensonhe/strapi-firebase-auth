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
import { Flex } from "@strapi/design-system/Flex";
import { ApiDestinationDialogue } from "../../components/UserManagement/ApiDestinationDialogue";

const CreateForm = () => {
  const [userData, setUserData] = useState({});
  const [isCreateDialogueOpen, setIsCreateDialogueOpen] = useState(false);
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

  const updateUserHandler = async (isStrapiIncluded, isFirebaseIncluded) => {
    setIsLoading(true);
    try {
      let destination;
      if (isStrapiIncluded && isFirebaseIncluded) {
        destination = null;
      } else if (isStrapiIncluded) {
        destination = "strapi";
      } else if (isFirebaseIncluded) destination = "firebase";
      console.log("destination", destination);
      const createdUser = await createUser(userData, destination);
      console.log({ createdUser });
      setUserData(() => createdUser);
      setOriginalUserData(() => createdUser);
      setIsCreateDialogueOpen(false);
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
      <ApiDestinationDialogue
        isOpen={isCreateDialogueOpen}
        onClose={() => setIsCreateDialogueOpen(false)}
        onSubmit={updateUserHandler}
        title="Create User"
      />
      <Header
        title="Create User"
        onSave={() => {
          setIsCreateDialogueOpen(true);
        }}
        isCreatingEntry
        initialData={originalUserData}
        modifiedData={userData}
      />
      <ContentLayout>
        <Flex gap={4} justifyContent="center">
          <Box
            background="neutral0"
            borderColor="neutral150"
            hasRadius
            width="70%"
          >
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
        </Flex>
      </ContentLayout>
    </Main>
  );
};

export default CreateForm;
