import React from "react";
import { DynamicTable as Table } from "@strapi/helper-plugin";
import { FirebaseTableRows } from "./FirebaseTableRows/FirebaseTableRows";
import { DeleteAccount } from "../UserManagement/DeleteAccount";
import { tableHeaders } from "./TableHeaders";
import { User } from "../../../../model/User";

interface FirebaseTableProps {
  action: React.ReactNode;
  isLoading: boolean;
  rows: User[];
  onConfirmDeleteAll: (idsToDelete: Array<string | number>) => Promise<void>;
  onResetPasswordClick: (data: User) => void;
  onDeleteAccountClick: (data: User) => void;
}

export const FirebaseTable = ({
  action,
  isLoading,
  rows,
  onConfirmDeleteAll,
  onResetPasswordClick,
  onDeleteAccountClick,
}: FirebaseTableProps) => {
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
      footer={null}
    >
      <FirebaseTableRows
        onResetPasswordClick={onResetPasswordClick}
        onDeleteAccountClick={onDeleteAccountClick}
        rows={rows}
      />
    </Table>
  );
};
