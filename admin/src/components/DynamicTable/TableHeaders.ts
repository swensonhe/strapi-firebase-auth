export const tableHeaders = [
  {
    name: "email",
    fieldSchema: {
      configurable: false,
      type: "email",
    },
    metadatas: {
      label: "Email",
      sortable: true,
      searchable: true,
    },
    key: "__email_key__",
  },
  {
    name: "uid",
    fieldSchema: {
      configurable: false,
      type: "string",
    },
    metadatas: {
      label: "User UID",
      sortable: false,
      searchable: true,
    },
    key: "__uid_key__",
  },
  {
    name: "providers",
    fieldSchema: {
      configurable: false,
      type: "icon",
    },
    metadatas: {
      label: "Providers",
      sortable: false,
      searchable: false,
    },
    key: "__provider_key__",
  },
  {
    name: "displayName",
    fieldSchema: {
      configurable: false,
      type: "string",
    },
    metadatas: {
      label: "Display Name",
      sortable: true,
      searchable: true,
    },
    key: "__displayName_key__",
  },
  {
    name: "emailVerified",
    fieldSchema: {
      configurable: false,
      type: "boolean",
    },
    metadatas: {
      label: "Email Verified",
      sortable: false,
      searchable: false,
    },
    key: "__emailVerified_key__",
  },
  {
    name: "disabled",
    fieldSchema: {
      configurable: false,
      type: "boolean",
    },
    metadatas: {
      label: "Disabled",
      sortable: false,
      searchable: false,
    },
    key: "__disabled_key__",
  },
  {
    name: "strapiId",
    fieldSchema: {
      configurable: false,
      type: "object",
    },
    metadatas: {
      label: "Strapi id",
      sortable: false,
      searchable: true,
    },
    key: "__strapiid_key__",
  },
  {
    name: "username",
    fieldSchema: {
      configurable: false,
      type: "string",
    },
    metadatas: {
      label: "strapi username",
      sortable: true,
      searchable: true,
    },
    key: "__username_key__",
  },
];
