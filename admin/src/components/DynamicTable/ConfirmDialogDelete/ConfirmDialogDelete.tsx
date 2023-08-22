import React from "react";
import { useIntl } from "react-intl";
import { Dialog, DialogBody, DialogFooter } from "@strapi/design-system";
import { Stack } from "@strapi/design-system";
import { Flex } from "@strapi/design-system";
import { Typography } from "@strapi/design-system";
import { Button } from "@strapi/design-system";
import { ExclamationMarkCircle } from "@strapi/icons";
import { Trash } from "@strapi/icons";

interface ConfirmDialogDeleteProps {
  isConfirmButtonLoading: boolean;
  isOpen: boolean;
  onToggleDialog: () => void;
  onConfirm: () => void;
}

export const ConfirmDialogDelete = ({
  isConfirmButtonLoading,
  isOpen,
  onToggleDialog,
  onConfirm,
}: ConfirmDialogDeleteProps) => {
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
            <Typography id="confirm-description">
              Are you sure you want to delete this?
            </Typography>
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
