import { getFetchClient } from "@strapi/helper-plugin";
import pluginId from "../../pluginId";

export const saveFirebaseConfig = async (json: string) => {
  try {
    const url = `/${pluginId}/settings/firebase-config`;
    const { post } = getFetchClient();
    const { data } = await post(url, { firebaseConfigJson: json });

    return data;
  } catch (e) {
    return [];
  }
};
