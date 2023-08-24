import React, { useEffect, useState } from "react";
import { Box } from "@strapi/design-system";
import { IconButton } from "@strapi/design-system";
import { Tbody, Td, Tr } from "@strapi/design-system";
import { Flex } from "@strapi/design-system";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";
import { BaseCheckbox } from "@strapi/design-system";
import { SimpleMenu, MenuItem } from "@strapi/design-system";
import { CarretDown } from "@strapi/icons";
import { RxCross2, RxCheck } from "react-icons/rx";
import { ResetPassword } from "../../UserManagement/ResetPassword";
import { DisableAccount } from "../../UserManagement/DisableAccount";
import { DeleteAccount } from "../../UserManagement/DeleteAccount";
import { Typography } from "@strapi/design-system";
import styled from "styled-components";
import { MapProviderToIcon } from "../../../utils/provider";
import { User } from "../../../../../model/User";

const TypographyMaxWidth = styled(Typography)`
  max-width: 300px;
`;

const CellLink = styled(Td)`
  text-decoration: underline;
  color: blue;
  &:hover {
    cursor: pointer;
  }
  & > span {
    color: blue;
  }
`;

interface FirebaseTableRowsProps {
  onConfirmDelete: (
    candidateID: string | null,
    isStrapiIncluded: boolean,
    isFirebaseIncluded: boolean
  ) => Promise<User[]>;
  rows: User[];
  entriesToDelete: string[];
  onSelectRow: ({ name, value }: { name: string; value: boolean }) => void;
}

export const FirebaseTableRows = ({
  onConfirmDelete,
  rows,
  entriesToDelete,
  onSelectRow,
}: FirebaseTableRowsProps) => {
  const [candidateID, setCandidateID] = useState<string | null>(null);
  const [rowsData, setRowsData] = useState<User[]>(rows);
  const [showResetPasswordDialogue, setShowResetPasswordDialogue] = useState({
    isOpen: false,
    email: "",
  });
  const [showDisableAccountDialogue, setShowDisableAccountDialogue] = useState({
    isOpen: false,
    email: "",
  });
  const [showDeleteAccountDialogue, setShowDeleteAccountDialogue] = useState({
    isOpen: false,
    email: "",
  });
  const {
    push,
    location: { pathname },
  } = useHistory();
  const { formatMessage } = useIntl();

  useEffect(() => {
    setRowsData(rows);
  }, [rows]);

  const history = useHistory();

  return (
    <>
      <ResetPassword
        isOpen={showResetPasswordDialogue.isOpen}
        email={showResetPasswordDialogue.email}
        onClose={() => {
          setShowResetPasswordDialogue({ isOpen: false, email: "" });
        }}
      />
      <DisableAccount
        isOpen={showDisableAccountDialogue.isOpen}
        email={showDisableAccountDialogue.email}
        onClose={() => {
          setShowDisableAccountDialogue({ isOpen: false, email: "" });
        }}
      />
      <DeleteAccount
        isOpen={showDeleteAccountDialogue.isOpen}
        email={showDeleteAccountDialogue.email}
        onClose={() => {
          setShowDeleteAccountDialogue({ isOpen: false, email: "" });
        }}
        onDelete={async (isStrapiIncluded, isFirebaseIncluded) => {
          console.log("candidateID", candidateID);
          const newRowsData = await onConfirmDelete(
            candidateID,
            isStrapiIncluded,
            isFirebaseIncluded
          );
          setShowDisableAccountDialogue({ isOpen: false, email: "" });
          setRowsData(newRowsData);
          setCandidateID(() => "");
        }}
      />
      <Tbody>
        {rowsData.map((data: User) => {
          console.log("dataaa", data);
          const isChecked =
            entriesToDelete.findIndex((id) => id === data.id) !== -1;

          console.log("data.email", data.email);
          return (
            <Tr key={data.uid}>
              <Box style={{ paddingLeft: 4, paddingRight: 4 }}>
                <BaseCheckbox
                  aria-label={formatMessage({
                    id: "app.component.table.select.one-entry",
                    defaultMessage: `Select {target}`,
                  })}
                  checked={isChecked}
                  onChange={() => {
                    onSelectRow({ name: data.id, value: !isChecked });
                  }}
                />
              </Box>
              <CellLink
                key={data.email}
                style={{ padding: 16 }}
                onClick={() => {
                  push({
                    pathname: `${pathname}/${data.uid}`,
                    state: { from: pathname },
                  });
                }}
              >
                <TypographyMaxWidth ellipsis textColor="neutral800">
                  {data.email}
                </TypographyMaxWidth>
              </CellLink>
              <Td key={data.uid}>
                <TypographyMaxWidth ellipsis textColor="neutral800">
                  {data.uid}
                </TypographyMaxWidth>
              </Td>
              <Td>
                <MapProviderToIcon
                  providerData={data.providerData}
                ></MapProviderToIcon>
              </Td>
              <Td>
                <TypographyMaxWidth ellipsis textColor="neutral800">
                  {data.displayName}
                </TypographyMaxWidth>
              </Td>
              <Td>
                {data.emailVerified ? (
                  <RxCheck size={24} />
                ) : (
                  <RxCross2 size={24} />
                )}
              </Td>
              <Td key={data.disabled}>
                {data.disabled ? <RxCheck size={24} /> : <RxCross2 size={24} />}
              </Td>
              <CellLink key={data.strapiId}>
                <TypographyMaxWidth ellipsis textColor="neutral800">
                  <Box
                    onClick={() => {
                      history.push(
                        `/content-manager/collectionType/plugin::users-permissions.user/${data.strapiId}`
                      );
                    }}
                  >
                    {data.strapiId}
                  </Box>
                </TypographyMaxWidth>
              </CellLink>
              <Td key={data.username}>
                <TypographyMaxWidth ellipsis textColor="neutral800">
                  {data.username}
                </TypographyMaxWidth>
              </Td>
              <Flex alignItems="center" paddingTop={3} gap={4}>
                <Box key={data.uid}>
                  <SimpleMenu
                    label="Actions"
                    as={IconButton}
                    icon={<CarretDown />}
                  >
                    <MenuItem
                      onClick={() => {
                        setShowResetPasswordDialogue({
                          isOpen: true,
                          email: data.email,
                        });
                      }}
                    >
                      Reset Password
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setShowDisableAccountDialogue({
                          isOpen: true,
                          email: data.email,
                        });
                      }}
                    >
                      Disable Account
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setShowDeleteAccountDialogue({
                          isOpen: true,
                          email: data.email,
                        });
                        setCandidateID(() => data.uid);
                      }}
                    >
                      Delete Account
                    </MenuItem>
                  </SimpleMenu>
                </Box>
              </Flex>
            </Tr>
          );
        })}
      </Tbody>
    </>
  );
};
