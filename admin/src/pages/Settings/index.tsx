import React,{useState} from "react";
import { JSONInput, Flex, Textarea, Box } from '@strapi/design-system';

function SettingsPage() {
  const [firebaseJsonValue, setFirebaseJsonValue] = useState('');
  const [apiKey, setApiKey] = useState('');

  return (
  <Flex style={{paddingLeft:32, paddingTop: 32}} direction="column" alignItems='flex-start'> 
    <Box style={{width:700}}>
      <JSONInput label="Firebase-json-configuration" value={firebaseJsonValue} height={500} style={{height:500}} onChange={setFirebaseJsonValue}/>
    </Box>
    <Box style={{marginTop: 16, width:700, height: 300}}>
      <Textarea
            id="dashboard_api_key"
            name="dashboard_api_key"
            label="Dashboard api key"
            style={{ height: 300 }} 
            value={apiKey}
            onChange={(e: any)=>setApiKey(e.target.value)}
          >          
        </Textarea>
    </Box>
  </Flex>
  );
}

export default SettingsPage;
