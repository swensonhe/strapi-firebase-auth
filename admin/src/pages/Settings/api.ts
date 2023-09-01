import { getFetchClient } from "@strapi/helper-plugin";
import pluginId from "../../pluginId";

export const restartServer = async () => {
  const url = `/${pluginId}/settings/restart`;
  const { post } = getFetchClient();
  await post(url);
};

export const saveFirebaseConfig = async (json: string) => {
  const url = `/${pluginId}/settings/firebase-config`;
  const { post } = getFetchClient();
  const { data } = await post(url, { firebaseConfigJson: json });
  return data;
};

export const getFirebaseConfig = async () => {
  const url = `/${pluginId}/settings/firebase-config`;
  const { get } = getFetchClient();
  const { data } = await get(url);
  return data;
};

export const delFirebaseConfig = async () => {
  const url = `/${pluginId}/settings/firebase-config`;
  const { del } = getFetchClient();
  const { data } = await del(url);
  return data;
};
