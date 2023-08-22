import React from "react";
import { Helmet } from "react-helmet";
import { Layout } from "@strapi/design-system";
import CreateForm from "./CreateForm";

export const CreateView = () => {
  return (
    <Layout>
      <Helmet title="Firebase User" />
      <CreateForm />
    </Layout>
  );
};
