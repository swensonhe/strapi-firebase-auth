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
  rows: User[];
  entriesToDelete?: string[];
  onSelectRow?: ({ name, value }: { name: string; value: boolean }) => void;
  onResetPasswordClick: (data: User) => void;
  onDeleteAccountClick: (data: User) => void;
}

export const FirebaseTableRows = ({
  rows,
  entriesToDelete,
  onSelectRow,
  onResetPasswordClick,
  onDeleteAccountClick,
}: FirebaseTableRowsProps) => {
  const [rowsData, setRowsData] = useState<User[]>(rows);
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
      <Tbody>
        {rowsData.map((data: User) => {
          const isChecked =
            entriesToDelete &&
            entriesToDelete.findIndex((id) => id === data.id) !== -1;

          return (
            <Tr key={data.uid}>
              <Box style={{ paddingLeft: 4, paddingRight: 4 }}>
                <BaseCheckbox
                  aria-label={formatMessage({
                    id: "app.component.table.select.one-entry",
                    defaultMessage: `Select {target}`,
                  })}
                  checked={isChecked}
                  onChange={(e: any) => {
                    onSelectRow &&
                      onSelectRow({ name: data.id, value: e.target.checked });
                  }}
                />
              </Box>
              <CellLink
                key={data.uid}
                onClick={() => {
                  push({
                    pathname: `${pathname}/${data.uid}`,
                    state: { from: pathname, strapiId: data.strapiId },
                  });
                }}
              >
                <TypographyMaxWidth ellipsis textColor="neutral800">
                  {data.uid}
                </TypographyMaxWidth>
              </CellLink>
              <CellLink key={data.strapiId}>
                <TypographyMaxWidth ellipsis textColor="neutral800">
                  <Box
                    onClick={() => {
                      history.push(
                        `/content-manager/collectionType/plugin::users-permissions.user/${data.strapiId}`,
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
              <Td>
                <TypographyMaxWidth ellipsis textColor="neutral800">
                  {data.displayName}
                </TypographyMaxWidth>
              </Td>
              <Td key={data.email} style={{ padding: 16 }}>
                <TypographyMaxWidth ellipsis textColor="neutral800">
                  {data.email}
                </TypographyMaxWidth>
              </Td>
              <Td key={data.phoneNumber} style={{ padding: 16 }}>
                <TypographyMaxWidth ellipsis textColor="neutral800">
                  {data.phoneNumber || '-'}
                </TypographyMaxWidth>
              </Td>
              <Td>
                <MapProviderToIcon
                  providerData={data.providerData}
                ></MapProviderToIcon>
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
              <Flex alignItems="center" paddingTop={3} gap={4}>
                <Box key={data.uid}>
                  <SimpleMenu
                    label="Actions"
                    as={IconButton}
                    icon={<CarretDown />}
                  >
                    <MenuItem
                      onClick={() => {
                        onResetPasswordClick(data);
                      }}
                    >
                      Reset Password
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        onDeleteAccountClick(data);
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
