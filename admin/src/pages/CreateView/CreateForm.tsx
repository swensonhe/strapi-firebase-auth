import React, { useState } from "react";
import { Stack } from "@strapi/design-system";
import { Main } from "@strapi/design-system";
import { ContentLayout } from "@strapi/design-system";
import { Box } from "@strapi/design-system";
import { TextInput } from "@strapi/design-system";
import { ToggleInput } from "@strapi/design-system";
import { LoadingIndicatorPage, useNotification } from "@strapi/helper-plugin";
import { createUser } from "../HomePage/utils/api";
import { Grid, GridItem } from "@strapi/design-system";
import { Header } from "../Header/Header";
import { User } from "../../../../model/User";

const CreateForm = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [originalUserData, setOriginalUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toggleNotification = useNotification();
  const onTextInputChange = (e: any) => {
    e.preventDefault();
    setUserData(
      (prevState: User | null) =>
        ({
          ...prevState,
          [e.target.name]: e.target.value,
        }) as User | null
    );
  };

  const onToggleInputChange = (e: any) => {
    setUserData(
      (prevState: User | null) =>
        ({
          ...prevState,
          [e.target.name]: e.target.checked,
        }) as User | null
    );
  };

  const updateUserHandler = async () => {
    if (!userData) return;
    setIsLoading(true);
    try {
      const createdUser = await createUser(userData);
      if (!createdUser) throw new Error("Error creating user");
      setUserData(createdUser);
      setOriginalUserData(createdUser);
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
      setUserData(null);
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
        isSubmitButtonDisabled={
          (!userData?.email && !userData?.phoneNumber) ||
          !!(userData?.password?.length && userData?.password?.length < 6)
        }
      />
      <ContentLayout>
        <Grid gap={4}>
          <GridItem col={9} s={12}>
            <Box background="neutral0" borderColor="neutral150" hasRadius>
              <Stack spacing={4} padding={3}>
                <TextInput
                  id="email"
                  name="email"
                  autoComplete="new-password"
                  onChange={onTextInputChange}
                  label="Email"
                  value={userData?.email}
                  error={!userData?.email && !userData?.phoneNumber ? "Email or Phone Number is required" : ""}
                />
                <TextInput
                  id="displayName"
                  name="displayName"
                  autoComplete="new-password"
                  onChange={onTextInputChange}
                  label="Display Name"
                  value={userData?.displayName}
                />
                <TextInput
                  id="phoneNumber"
                  name="phoneNumber"
                  autoComplete="new-password"
                  onChange={onTextInputChange}
                  label="Phone Number"
                  value={userData?.phoneNumber}
                />
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  onChange={onTextInputChange}
                  autoComplete="new-password"
                  label="Password"
                  value={userData?.password}
                  error={
                    userData?.password?.length && userData?.password?.length < 6
                      ? "Password must be at least 6 characters"
                      : ""
                  }
                />
                <ToggleInput
                  label="Disabled"
                  name="disabled"
                  onLabel="True"
                  offLabel="False"
                  checked={Boolean(userData?.disabled)}
                  onChange={onToggleInputChange}
                />
                <ToggleInput
                  label="Email Verified"
                  name="emailVerified"
                  onLabel="True"
                  offLabel="False"
                  checked={Boolean(userData?.emailVerified)}
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
