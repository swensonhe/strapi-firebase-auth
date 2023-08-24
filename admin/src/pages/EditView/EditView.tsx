import React from "react";
import { Helmet } from "react-helmet";
import { Layout } from "@strapi/design-system";
import { useParams } from "react-router-dom";
import { fetchUserByID } from "../HomePage/utils/api";
import { useQuery } from "react-query";
import { LoadingIndicatorPage, useNotification } from "@strapi/helper-plugin";
import { EditForm } from "./EditForm";

export const EditView = () => {
  const { id }: { id: string } = useParams();
  const toggleNotification = useNotification();
  const { status, data } = useQuery(
    `firebase-auth-${id}`,
    () => fetchUserByID(id),
    {
      onError: () => {
        toggleNotification({
          type: "warning",
          message: {
            id: "notification.error",
            defaultMessage: "An error occured",
          },
        });
      },
    }
  );

  const isLoadingUsersData = status !== "success" && status !== "error";

  if (isLoadingUsersData) {
    return <LoadingIndicatorPage />;
  }

  return (
    <Layout>
      <Helmet title="Firebase User" />
      <EditForm data={data} />
    </Layout>
  );
};
