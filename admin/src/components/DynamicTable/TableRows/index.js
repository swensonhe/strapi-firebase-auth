import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@strapi/design-system/Box";
import { IconButton } from "@strapi/design-system/IconButton";
import { Tbody, Td, Tr } from "@strapi/design-system/Table";
import Trash from "@strapi/icons/Trash";
import { Flex } from "@strapi/design-system/Flex";
import { stopPropagation, onRowClick } from "@strapi/helper-plugin";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import CellContent from "../CellContent";
import ConfirmDialogDelete from "../ConfirmDialogDelete";
import { BaseCheckbox } from "@strapi/design-system/BaseCheckbox";
import { SimpleMenu, MenuItem } from "@strapi/design-system/v2";
import { CarretDown } from "@strapi/icons";
import { RxCross2, RxCheck } from "react-icons/rx";
import { ResetPassword } from "../../UserManagement/ResetPassword";
import { DisableAccount } from "../../UserManagement/DisableAccount";
import { DeleteAccount } from "../../UserManagement/DeleteAccount";

const TableRows = ({
  canDelete,
  onConfirmDelete,
  headers,
  rows,
  withMainAction,
  entriesToDelete,
  onSelectRow,
}) => {
  const [candidateID, setCandidateID] = useState(null);
  const [rowsData, setRowsData] = useState(rows);
  const [showResetPasswordDialogue, setShowResetPasswordDialogue] = useState({
    isOpen: false,
    email: null,
  });
  const [showDisableAccountDialogue, setShowDisableAccountDialogue] = useState({
    isOpen: false,
    email: null,
  });
  const [showDeleteAccountDialogue, setShowDeleteAccountDialogue] = useState({
    isOpen: false,
    email: null,
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
          setShowResetPasswordDialogue({ isOpen: false, email: null });
        }}
      />
      <DisableAccount
        isOpen={showDisableAccountDialogue.isOpen}
        email={showDisableAccountDialogue.email}
        onClose={() => {
          setShowDisableAccountDialogue({ isOpen: false, email: null });
        }}
      />
      <DeleteAccount
        isOpen={showDeleteAccountDialogue.isOpen}
        email={showDeleteAccountDialogue.email}
        onClose={() => {
          setShowDeleteAccountDialogue({ isOpen: false, email: null });
        }}
        onDelete={async (isStrapiIncluded, isFirebaseIncluded) => {
          console.log("candidateID", candidateID);
          const newRowsData = await onConfirmDelete(
            candidateID,
            isStrapiIncluded,
            isFirebaseIncluded
          );
          setRowsData(() => newRowsData);
          setCandidateID(() => "");
        }}
      />
      <Tbody>
        {rowsData.map((data, index) => {
          console.log("dataaa", data);
          const isChecked =
            entriesToDelete.findIndex((id) => id === data.id) !== -1;

          const itemLineText = formatMessage(
            {
              id: "content-manager.components.DynamicTable.row-line",
              defaultMessage: "item line {number}",
            },
            { number: index }
          );
          console.log("data.email", data.email);
          return (
            <Tr
              key={data.uid}
              {...onRowClick({
                fn: () => {
                  push({
                    pathname: `${pathname}/${data.uid}`,
                    state: { from: pathname },
                  });
                },
                condition: true,
              })}
            >
              {withMainAction && (
                <Td {...stopPropagation}>
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
                </Td>
              )}
              {headers.map(
                ({ key, cellFormatter, name, fieldSchema, ...rest }) => {
                  return (
                    <Td
                      key={key}
                      {...(name === "strapiId" && { ...stopPropagation })}
                    >
                      {fieldSchema.type === "boolean" ? (
                        data[name.split(".")[0]] ? (
                          <RxCheck size={24} />
                        ) : (
                          <RxCross2 size={24} />
                        )
                      ) : typeof cellFormatter === "function" ? (
                        cellFormatter(data, { key, name, fieldSchema, ...rest })
                      ) : (
                        <CellContent
                          content={
                            name === "strapiId" ? (
                              <Box
                                style={{
                                  textDecoration: "underline",
                                  color: "blue",
                                }}
                                onClick={() => {
                                  history.push(
                                    `/content-manager/collectionType/plugin::users-permissions.user/${
                                      data[name.split(".")[0]]
                                    }`
                                  );
                                }}
                              >
                                {data[name.split(".")[0]]}
                              </Box>
                            ) : (
                              data[name.split(".")[0]]
                            )
                          }
                          name={name}
                          fieldSchema={fieldSchema}
                          {...rest}
                          rowId={data.id}
                        />
                      )}
                    </Td>
                  );
                }
              )}
              <Flex alignItems="center" paddingTop={4} gap={4}>
                <Box key={data.uid} {...stopPropagation}>
                  <SimpleMenu
                    label="Actions"
                    as={IconButton}
                    icon={<CarretDown />}
                    onBlur={() => {}}
                  >
                    <MenuItem
                      onSelect={() => {
                        setShowResetPasswordDialogue({
                          isOpen: true,
                          email: data.email,
                        });
                      }}
                    >
                      Reset Password
                    </MenuItem>
                    <MenuItem
                      onSelect={() => {
                        setShowDisableAccountDialogue({
                          isOpen: true,
                          email: data.email,
                        });
                      }}
                    >
                      Disable Account
                    </MenuItem>
                    <MenuItem
                      onSelect={() => {
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

TableRows.defaultProps = {
  canCreate: false,
  canDelete: false,
  entriesToDelete: [],
  onClickDelete: () => {},
  onSelectRow: () => {},
  rows: [],
  withBulkActions: false,
  withMainAction: false,
};

TableRows.propTypes = {
  canCreate: PropTypes.bool,
  canDelete: PropTypes.bool,
  entriesToDelete: PropTypes.array,
  headers: PropTypes.array.isRequired,
  onClickDelete: PropTypes.func,
  onSelectRow: PropTypes.func,
  rows: PropTypes.array,
  withBulkActions: PropTypes.bool,
  withMainAction: PropTypes.bool,
};

export default TableRows;
