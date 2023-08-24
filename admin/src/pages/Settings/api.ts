import axios from "axios";
import { auth } from "@strapi/helper-plugin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let CUSTOM_VARIABLES: any;

const token = auth.getToken();
console.log("tokennnnn", token);
export const saveToken = async (apiToken: string) => {
  const HOST = process.env.STRAPI_ADMIN_BACKEND_URL;
  try {
    const { data } = await axios.post(
      `${HOST}/api/firebase-auth/settings/token`,
      { token: apiToken },
      {
        headers: {
          Authorization: `Bearer ${CUSTOM_VARIABLES.dashboardApiToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (e) {
    console.log("e", e);
    return [];
  }
};

export const saveFirebaseConfig = async (json: string) => {
  const HOST = process.env.STRAPI_ADMIN_BACKEND_URL;
  try {
    const { data } = await axios.post(
      `${HOST}/api/firebase-auth/settings/firebase-config`,
      { firebaseConfigJson: json },
      {
        headers: {
          Authorization: `Bearer ${CUSTOM_VARIABLES.dashboardApiToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (e) {
    console.log("e", e);
    return [];
  }
};
