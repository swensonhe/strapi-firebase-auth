import React, { useState, useEffect } from "react";
import {
  JSONInput,
  Flex,
  Box,
  Button,
  Typography,
} from "@strapi/design-system";
import { LoadingIndicatorPage, useNotification } from "@strapi/helper-plugin";
import {
  delFirebaseConfig,
  getFirebaseConfig,
  restartServer,
  saveFirebaseConfig,
} from "./api";
import { Trash } from "@strapi/icons";
import { DeleteJsonConfigurationDialogue } from "./DeleteJsonConfigurationDialogue";
import { useHistory } from "react-router-dom";

function SettingsPage() {
  const toggleNotification = useNotification();
  const [firebaseJsonValue, setFirebaseJsonValue] = useState<any>(null);
  const [firebaseJsonValueInput, setFirebaseJsonValueInput] = useState<any>("");
  const [isDeleteDialogueOpen, setIsDeleteDialogueOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const handleRetrieveFirebaseJsonConfig = () => {
    setLoading(true);
    getFirebaseConfig()
      .then((data) => {
        setLoading(false);
        setFirebaseJsonValue(data);
        setFirebaseJsonValueInput(data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleRetrieveFirebaseJsonConfig();
  }, []);

  const handleDeleteFirebaseJsonConfig = async () => {
    try {
      setLoading(true);
      await delFirebaseConfig();
      setFirebaseJsonValue("");
      setFirebaseJsonValueInput("");
      // restartServer();
      setLoading(false);
      toggleNotification({
        type: "success",
        message: "Firebase configuration has successfully been removed",
      });
      setIsDeleteDialogueOpen(false);
    } catch (err) {
      setLoading(false);
      toggleNotification({
        type: "warning",
        message: "An error occured, please try again",
      });
      setIsDeleteDialogueOpen(false);
    }
  };

  const handleFirebaseJsonSubmit = async () => {
    try {
      setLoading(true);
      const data = await saveFirebaseConfig(firebaseJsonValueInput);
      setFirebaseJsonValue(data["firebase_config_json"]);
      setLoading(false);
      toggleNotification({
        type: "success",
        message: {
          id: "notification.success",
          defaultMessage: "Data submitted successfully",
        },
      });
      // restartServer();
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

  const isJsonString = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  return (
    <>
      <DeleteJsonConfigurationDialogue
        isOpen={isDeleteDialogueOpen}
        onToggleDialog={() => {
          setIsDeleteDialogueOpen(false);
        }}
        onConfirm={handleDeleteFirebaseJsonConfig}
      />
      <Flex
        style={{ padding: 32 }}
        direction="column"
        alignItems="flex-start"
        gap={4}
      >
        <Box style={{ width: "100%" }}>
          {!firebaseJsonValue ? (
            <>
              <JSONInput
                label="Firebase-json-configuration"
                value={firebaseJsonValueInput}
                height={500}
                style={{ height: 400 }}
                onChange={setFirebaseJsonValueInput}
                error={
                  firebaseJsonValueInput &&
                  !isJsonString(firebaseJsonValueInput)
                    ? "Please enter a valid JSON string"
                    : ""
                }
              />
              <Flex
                style={{
                  marginTop: 32,
                  width: "100%",
                  padding: 16,
                }}
                justifyContent="flex-end"
              >
                <Button
                  size="L"
                  onClick={handleFirebaseJsonSubmit}
                  disabled={!isJsonString(firebaseJsonValueInput)}
                >
                  Submit
                </Button>
              </Flex>
            </>
          ) : (
            <>
              <Flex gap={4}>
                You have successfully submitted your json configuration for
                project:{" "}
                <span style={{ fontWeight: 700 }}>
                  {(firebaseJsonValue &&
                    JSON.parse(firebaseJsonValue.firebaseConfigJson)
                      .project_id) ||
                    JSON.parse(firebaseJsonValue.firebaseConfigJson).projectId}
                </span>
                <button
                  onClick={() => {
                    setIsDeleteDialogueOpen(true);
                  }}
                >
                  <Trash />
                </button>
              </Flex>
              <Button
                onClick={() => history.push("/plugins/firebase-auth")}
                marginTop={4}
              >
                Back to firebase plugin
              </Button>
            </>
          )}
          {!firebaseJsonValue ? (
            <Flex direction="column" alignItems="flex-start" marginTop={10}>
              How to setup the firebase configuration:
              <Box marginTop={2} marginLeft={6}>
                <ol style={{ listStyle: "auto" }}>
                  <li style={{ marginTop: 32 }}>
                    <Typography>
                      Go to your Project{" "}
                      <a
                        href="https://console.firebase.google.com/project/_/settings/general/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        settings
                      </a>{" "}
                      in the Firebase console.
                    </Typography>
                  </li>
                  <li style={{ marginTop: 32 }}>
                    <Typography>
                      Select the project in your list of projects
                    </Typography>
                  </li>
                  <li style={{ marginTop: 32 }}>
                    <Typography>
                      Scroll down to the apps section and select your app
                    </Typography>
                    <img
                      src={require("../../assets/firebase-config-tutorial/select-app.png")}
                      style={{ maxWidth: "100%", marginTop: 32 }}
                    />
                  </li>
                  <li style={{ marginTop: 32 }}>
                    <Typography>
                      Select Config from the Firebase SDK snippet pane and copy
                      the JSON object.
                    </Typography>
                    <div>
                      <img
                        src={require("../../assets/firebase-config-tutorial/config.png")}
                        style={{ maxWidth: "100%", marginTop: 32 }}
                      />
                    </div>
                  </li>
                  <li style={{ marginTop: 32 }}>
                    <Typography>
                      Stringify the JSON object and Paste it in the
                      Firebase-json-configuration input field above and click
                      submit.
                    </Typography>
                    <div style={{ marginTop: 24 }}>
                      <img
                        src={require("../../assets/firebase-config-tutorial/submission.png")}
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                  </li>
                </ol>
              </Box>
            </Flex>
          ) : null}
        </Box>
      </Flex>
    </>
  );
}

export default SettingsPage;
