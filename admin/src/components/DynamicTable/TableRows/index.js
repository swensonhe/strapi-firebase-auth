import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@strapi/design-system/Box";
import { IconButton } from "@strapi/design-system/IconButton";
import { Tbody, Td, Tr } from "@strapi/design-system/Table";
import Trash from "@strapi/icons/Trash";
import { Flex } from "@strapi/design-system/Flex";
import { stopPropagation, onRowClick } from "@strapi/helper-plugin";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";
import CellContent from "../CellContent";
import ConfirmDialogDelete from "../ConfirmDialogDelete";
import { BaseCheckbox } from "@strapi/design-system/BaseCheckbox";
import { SimpleMenu, MenuItem } from "@strapi/design-system";
import { CarretDown } from "@strapi/icons";

const TableRows = ({
  canDelete,
  onConfirmDelete,
  headers,
  rows,
  withMainAction,
  entriesToDelete,
  onSelectRow,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [candidateID, setCandidateID] = useState(false);
  const [rowsData, setRowsData] = useState(rows);
  const {
    push,
    location: { pathname },
  } = useHistory();
  const { formatMessage } = useIntl();

  const onClickDelete = (idToDelete) => {
    setIsOpen((prevState) => !prevState);
    setCandidateID(() => idToDelete);
  };

  console.log("rowsData", rowsData);

  return (
    <>
      <Tbody>
        {rowsData.map((data, index) => {
          const isChecked =
            entriesToDelete.findIndex((id) => id === data.id) !== -1;

          const itemLineText = formatMessage(
            {
              id: "content-manager.components.DynamicTable.row-line",
              defaultMessage: "item line {number}",
            },
            { number: index }
          );

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
              {headers.map(({ key, cellFormatter, name, ...rest }) => {
                return (
                  <Td key={key}>
                    {typeof cellFormatter === "function" ? (
                      cellFormatter(data, { key, name, ...rest })
                    ) : (
                      <CellContent
                        content={data[name.split(".")[0]]}
                        name={name}
                        {...rest}
                        rowId={data.id}
                      />
                    )}
                  </Td>
                );
              })}

              {canDelete && (
                <Td {...stopPropagation}>
                  <Flex justifyContent="center">
                    <Box paddingLeft={1}>
                      <IconButton
                        onClick={() => {
                          onClickDelete(data.id);
                        }}
                        label={formatMessage(
                          {
                            id: "app.component.table.delete",
                            defaultMessage: "Delete {target}",
                          },
                          { target: itemLineText }
                        )}
                        noBorder
                        icon={<Trash />}
                      />
                    </Box>
                  </Flex>
                </Td>
              )}
              <Td key={data.uid} {...stopPropagation}>
                <SimpleMenu
                  label="Menu"
                  as={IconButton}
                  icon={<CarretDown />}
                  onClick={(e) => {
                    // e.stopPropagation();
                  }}
                >
                  <MenuItem onClick={() => {}}>Reset Password</MenuItem>
                  <MenuItem onClick={() => {}}>Disable Account</MenuItem>
                  <MenuItem
                    onClick={() => {}}
                    href="https://strapi.io/"
                    isExternal
                  >
                    Somewhere External
                  </MenuItem>
                </SimpleMenu>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
      <ConfirmDialogDelete
        isConfirmButtonLoading={isLoading}
        isOpen={isOpen}
        onToggleDialog={() => {
          setIsOpen(false);
        }}
        onConfirm={async () => {
          setIsLoading(true);
          const newRowsData = await onConfirmDelete(candidateID);
          setRowsData(() => newRowsData);
          setIsLoading(() => false);
          setIsOpen(() => false);
          setCandidateID(() => "");
        }}
      />
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
