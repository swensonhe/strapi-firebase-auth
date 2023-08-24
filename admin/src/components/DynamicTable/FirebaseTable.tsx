import React, { useState } from "react";
import { DynamicTable as Table } from "@strapi/helper-plugin";
import { FirebaseTableRows } from "./FirebaseTableRows/FirebaseTableRows";
import { ConfirmDialogDelete } from "./ConfirmDialogDelete/ConfirmDialogDelete";
import { tableHeaders } from "./TableHeaders";
import { User } from "../../../../model/User";

interface FirebaseTableProps {
  action: React.ReactNode;
  isLoading: boolean;
  onConfirmDelete: (
    candidateID: string | null,
    isStrapiIncluded: boolean,
    isFirebaseIncluded: boolean
  ) => Promise<User[]>;
  rows: User[];
  onConfirmDeleteAll: (
    idsToDelete: string[],
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
  const [entriesToDelete, setEntriesToDelete] = useState<string[]>([]);

  const handleSelectRow = ({ name, value }: { name: string; value: any }) => {
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
      withMainAction
      withBulkActions
      onConfirmDeleteAll={onConfirmDeleteAll}
    >
      <FirebaseTableRows
        onConfirmDelete={onConfirmDelete}
        rows={rows}
        onSelectRow={handleSelectRow}
        entriesToDelete={entriesToDelete}
      />
    </Table>
  );
};
