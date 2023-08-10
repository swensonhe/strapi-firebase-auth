import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { Dialog, DialogBody, DialogFooter } from "@strapi/design-system/Dialog";
import { Stack } from "@strapi/design-system/Stack";
import { Flex } from "@strapi/design-system/Flex";
import { Typography } from "@strapi/design-system/Typography";
import { Button } from "@strapi/design-system/Button";
import ExclamationMarkCircle from "@strapi/icons/ExclamationMarkCircle";
import Trash from "@strapi/icons/Trash";

const ConfirmDialogDelete = ({ isConfirmButtonLoading, isOpen, onToggleDialog, onConfirm }) => {
  const { formatMessage } = useIntl();
  return (
    <Dialog
      onClose={onToggleDialog}
      title={formatMessage({
        id: "app.components.ConfirmDialog.title",
        defaultMessage: "Confirmation",
      })}
      labelledBy="confirmation"
      describedBy="confirm-description"
      isOpen={isOpen}
    >
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Stack size={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">Are you sure you want to delete this?</Typography>
          </Flex>
        </Stack>
      </DialogBody>
      <DialogFooter
        startAction={
          <Button onClick={onToggleDialog} variant="tertiary">
            Cancel
          </Button>
        }
        endAction={
          <Button
            onClick={onConfirm}
            variant="danger-light"
            startIcon={<Trash />}
            id="confirm-delete"
            loading={isConfirmButtonLoading}
          >
            Confirm
          </Button>
        }
      />
    </Dialog>
  );
};

ConfirmDialogDelete.propTypes = {
  isConfirmButtonLoading: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onToggleDialog: PropTypes.func.isRequired,
};

export default ConfirmDialogDelete;
