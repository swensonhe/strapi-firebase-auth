import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { DynamicTable as Table } from "@strapi/helper-plugin";
import TableRows from "./TableRows";
import ConfirmDialogDelete from "./ConfirmDialogDelete";

const DynamicTable = ({
  canCreate,
  canDelete,
  action,
  isBulkable,
  isLoading,
  onConfirmDelete,
  rows,
  onConfirmDeleteAll,
}) => {
  console.log("rowsss", rows);
  const tableHeaders = useMemo(() => {
    return [
      {
        name: "email",
        fieldSchema: {
          configurable: false,
          type: "email",
        },
        metadatas: {
          label: "Email",
          sortable: false,
          searchable: false,
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
          sortable: true,
          searchable: false,
        },
        key: "__uid_key__",
      },
      {
        name: "strapiId",
        fieldSchema: {
          configurable: false,
          type: "string",
        },
        metadatas: {
          label: "Strapi id",
          sortable: true,
          searchable: false,
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
          sortable: true,
          searchable: false,
        },
        key: "__provider_key__",
      },
      {
        name: "phoneNumber",
        fieldSchema: {
          configurable: false,
          type: "string",
        },
        metadatas: {
          label: "Phone",
          sortable: false,
          searchable: false,
        },
        key: "__phoneNumber_key__",
      },
      {
        name: "displayName",
        fieldSchema: {
          configurable: false,
          type: "string",
        },
        metadatas: {
          label: "Display Name",
          sortable: false,
          searchable: false,
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
    ];
  });

  const [entriesToDelete, setEntriesToDelete] = useState([]);

  const handleSelectRow = ({ name, value }) => {
    setEntriesToDelete((prev) => {
      if (value) {
        return prev.concat(name);
      }

      return prev.filter((id) => id !== name);
    });
  };

  return (
    <Table
      components={{ ConfirmDialogDelete }}
      contentType="Firebase Users"
      action={action}
      isLoading={isLoading}
      headers={tableHeaders}
      rows={rows}
      withMainAction={canDelete && isBulkable}
      withBulkActions
      onConfirmDeleteAll={onConfirmDeleteAll}
    >
      <TableRows
        canCreate={canCreate}
        canDelete={canDelete}
        headers={tableHeaders}
        onConfirmDelete={onConfirmDelete}
        rows={rows}
        withBulkActions
        withMainAction={canDelete && isBulkable}
        onSelectRow={handleSelectRow}
        entriesToDelete={entriesToDelete}
      />
    </Table>
  );
};

DynamicTable.defaultProps = {
  action: undefined,
};

DynamicTable.propTypes = {
  canCreate: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  contentTypeName: PropTypes.string.isRequired,
  action: PropTypes.node,
  isBulkable: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  layout: PropTypes.exact({
    components: PropTypes.object.isRequired,
    contentType: PropTypes.shape({
      attributes: PropTypes.object.isRequired,
      metadatas: PropTypes.object.isRequired,
      layouts: PropTypes.shape({
        list: PropTypes.array.isRequired,
        editRelations: PropTypes.array,
      }).isRequired,
      options: PropTypes.object.isRequired,
      settings: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
  onConfirmDelete: PropTypes.func.isRequired,
  onConfirmDeleteAll: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
};

export default DynamicTable;
