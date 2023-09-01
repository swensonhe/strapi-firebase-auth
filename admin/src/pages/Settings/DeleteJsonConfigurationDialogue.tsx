import React from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Flex,
  Typography,
  Button,
} from "@strapi/design-system";
import { ExclamationMarkCircle } from "@strapi/icons";

interface DeleteJsonConfigurationDialogueProps {
  isOpen: boolean;
  onToggleDialog: () => void;
  onConfirm: () => void;
}

export const DeleteJsonConfigurationDialogue = ({
  isOpen,
  onConfirm,
  onToggleDialog,
}: DeleteJsonConfigurationDialogueProps) => {
  return (
    <>
      <Dialog onClose={onToggleDialog} title="Delete Account" isOpen={isOpen}>
        <DialogBody icon={<ExclamationMarkCircle />}>
          <Flex direction="column" alignItems="center" gap={2}>
            <Flex justifyContent="flex-start" textAlign="center">
              <Typography textColor="danger700">
                Are you sure you want to delete your current firebase
                configuration?
              </Typography>
            </Flex>
          </Flex>
        </DialogBody>
        <DialogFooter
          startAction={
            <Button onClick={onToggleDialog} variant="tertiary">
              Cancel
            </Button>
          }
          endAction={
            <Button variant="danger" onClick={onConfirm}>
              Delete
            </Button>
          }
        />
      </Dialog>
    </>
  );
};
