import React, { useState } from "react";
import { DynamicTable as Table } from "@strapi/helper-plugin";
import { FirebaseTableRows } from "./FirebaseTableRows/FirebaseTableRows";
import { DeleteAccount } from "../UserManagement/DeleteAccount";
import { tableHeaders } from "./TableHeaders";
import { User } from "../../../../model/User";

interface FirebaseTableProps {
  action: React.ReactNode;
  isLoading: boolean;
  onConfirmDelete: (
    candidateID: string | string[],
    isStrapiIncluded: boolean,
    isFirebaseIncluded: boolean
  ) => Promise<User[]>;
  rows: User[];
  onConfirmDeleteAll: (
    idsToDelete: string | string[],
    isStrapiIncluded: boolean,
    isFirebaseIncluded: boolean
  ) => void;
}

export const FirebaseTable = ({
  action,
  isLoading,
  onConfirmDelete,
  rows,
  onConfirmDeleteAll,
}: FirebaseTableProps) => {
  console.log("hiii");

  return (
    <Table
      components={{ ConfirmDialogDeleteAll: DeleteAccount }}
      contentType="Firebase Users"
      action={action}
      isLoading={isLoading}
      headers={tableHeaders}
      rows={rows}
      withMainAction
      withBulkActions
      onConfirmDeleteAll={onConfirmDeleteAll}
    >
      <FirebaseTableRows onConfirmDelete={onConfirmDelete} rows={rows} />
    </Table>
  );
};
