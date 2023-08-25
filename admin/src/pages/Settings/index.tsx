import React, { useState } from "react";
import { JSONInput, Flex, Textarea, Box, Button } from "@strapi/design-system";
import { LoadingIndicatorPage, useNotification } from "@strapi/helper-plugin";
import { saveFirebaseConfig, saveToken } from "./api";

function SettingsPage() {
  const toggleNotification = useNotification();
  const [firebaseJsonValue, setFirebaseJsonValue] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTokenSubmit = async () => {
    try {
      setLoading(true);
      await saveToken(apiToken);
      setLoading(false);
      toggleNotification({
        type: "success",
        message: {
          id: "notification.success",
          defaultMessage: "Data submitted successfully",
        },
      });
    } catch (error) {
      toggleNotification({
        type: "warning",
        message: {
          id: "notification.error",
          defaultMessage: "some thing went wrong",
        },
      });
    }
  };

  const handleFirebaseJsonSubmit = async () => {
    try {
      setLoading(true);
      await saveFirebaseConfig(firebaseJsonValue);
      setLoading(false);
      toggleNotification({
        type: "success",
        message: {
          id: "notification.success",
          defaultMessage: "Data submitted successfully",
        },
      });
    } catch (error) {
      toggleNotification({
        type: "warning",
        message: {
          id: "notification.error",
          defaultMessage: "some thing went wrong",
        },
      });
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicatorPage />;
  }
  return (
    <Flex
      style={{ padding: 32 }}
      direction="column"
      alignItems="flex-start"
      gap={4}
    >
      <Box style={{ width: "100%" }}>
        <JSONInput
          label="Firebase-json-configuration"
          value={firebaseJsonValue}
          height={500}
          style={{ height: 400 }}
          onChange={setFirebaseJsonValue}
        />
        <Flex
          style={{
            marginTop: 16,
            width: "100%",
            padding: 16,
          }}
          justifyContent="flex-end"
        >
          <Button size="L" onClick={handleFirebaseJsonSubmit}>
            Submit
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}

export default SettingsPage;
