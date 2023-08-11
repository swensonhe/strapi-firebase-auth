import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Flex,
  Typography,
  Button,
} from "@strapi/design-system";
import { ExclamationMarkCircle } from "@strapi/icons";

interface DeleteAccountProps {
  isOpen: boolean;
  email: boolean;
  onClose: () => void;
}

export const DeleteAccount = ({
  isOpen,
  email,
  onClose,
}: DeleteAccountProps) => {
  return (
    <>
      <Dialog onClose={onClose} title="Delete Account" isOpen={isOpen}>
        <DialogBody icon={<ExclamationMarkCircle />}>
          <Flex direction="column" alignItems="center" gap={2}>
            <Flex justifyContent="flex-start" textAlign="center">
              <Typography textColor="danger700">
                After you delete an account, it's permanently deleted. Accounts
                can't be undeleted.
              </Typography>
            </Flex>
            <Flex justifyContent="flex-start" marginTop={2}>
              <Typography variant="sigma">User account</Typography>
            </Flex>
            <Flex justifyContent="flex-start">
              <Typography>{email}</Typography>
            </Flex>
          </Flex>
        </DialogBody>
        <DialogFooter
          startAction={
            <Button onClick={onClose} variant="tertiary">
              Cancel
            </Button>
          }
          endAction={<Button variant="danger">Delete</Button>}
        />
      </Dialog>
    </>
  );
};
