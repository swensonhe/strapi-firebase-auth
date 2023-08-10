import React from "react";
import { Helmet } from "react-helmet";
import { Layout } from "@strapi/design-system/Layout";
import CreateForm from "./CreateForm";

const CreateView = () => {
  return (
    <Layout>
      <Helmet title="Firebase User" />
      <CreateForm />
    </Layout>
  );
};

export default CreateView;
