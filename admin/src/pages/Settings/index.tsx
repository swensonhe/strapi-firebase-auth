import React, { useState } from "react";
import {
  JSONInput,
  Flex,
  Box,
  Button,
  Typography,
} from "@strapi/design-system";
import { LoadingIndicatorPage, useNotification } from "@strapi/helper-plugin";
import { saveFirebaseConfig } from "./api";

function SettingsPage() {
  const toggleNotification = useNotification();
  const [firebaseJsonValue, setFirebaseJsonValue] = useState("");
  const [loading, setLoading] = useState(false);

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
        <Flex direction="column" alignItems="flex-start">
          How to get the firebase configuration:
          <Box marginTop={2} marginLeft={6}>
            <ol style={{ listStyle: "auto" }}>
              <li style={{ marginTop: 16 }}>
                <Typography>
                  Go to your Project{" "}
                  <a href="https://console.firebase.google.com/project/_/settings/general/">
                    settings
                  </a>{" "}
                  in the Firebase console.
                </Typography>
              </li>
              <li style={{ marginTop: 16 }}>
                <Typography>
                  Select the project in your list of projects
                </Typography>
              </li>
              <li style={{ marginTop: 16 }}>
                <Typography>
                  Scroll down to the apps section and select your app
                </Typography>
                <img
                  src={require("../../assets/firebase-config-tutorial/select-app.png")}
                  style={{ maxWidth: "100%", marginTop: 16 }}
                />
              </li>
              <li style={{ marginTop: 16 }}>
                <Typography>
                  Select Config from the Firebase SDK snippet pane and copy the
                  JSON object.
                </Typography>
                <img
                  src={require("../../assets/firebase-config-tutorial/config.png")}
                  style={{ maxWidth: "100%", marginTop: 16 }}
                />
              </li>
              <li style={{ marginTop: 16 }}>
                <Typography>
                  Paste the JSON object in the Firebase-json-configuration input
                  field above and click submit.
                </Typography>
                <img
                  src={require("../../assets/firebase-config-tutorial/submission.png")}
                  style={{ maxWidth: "100%" }}
                />
              </li>
            </ol>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}

export default SettingsPage;
