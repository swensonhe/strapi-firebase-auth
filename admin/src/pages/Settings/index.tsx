import React, { useState } from "react";
import {
  JSONInput,
  Flex,
  Textarea,
  Box,
  Button,
  Information,
} from "@strapi/design-system";

function SettingsPage() {
  const [firebaseJsonValue, setFirebaseJsonValue] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    const 
  };
  return (
    <Flex
      style={{ padding: 32 }}
      direction="column"
      alignItems="flex-start"
      gap={8}
    >
      <Box style={{ width: "100%" }}>
        <JSONInput
          label="Firebase-json-configuration"
          value={firebaseJsonValue}
          height={500}
          style={{ height: 500 }}
          onChange={setFirebaseJsonValue}
        />
      </Box>
      <Box style={{ marginTop: 16, width: "100%", height: 300 }}>
        <Textarea
          id="dashboard_api_key"
          name="dashboard_api_key"
          label="Dashboard api key"
          style={{ height: 300 }}
          value={apiKey}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(e: any) => setApiKey(e.target.value)}
        ></Textarea>
      </Box>
      <Flex
        style={{ marginTop: 16, width: "100%", padding: 16 }}
        justifyContent="flex-end"
      >
        <Button startIcon={<Information />} loading={loading} size="large">
          Submit
        </Button>
      </Flex>
    </Flex>
  );
}

export default SettingsPage;
