import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Flex,
  Typography,
  Button,
} from "@strapi/design-system";

interface ResetPasswordProps {
  isOpen: boolean;
  email: boolean;
  onClose: () => void;
}

export const ResetPassword = ({
  isOpen,
  email,
  onClose,
}: ResetPasswordProps) => {
  return (
    <>
      <Dialog onClose={onClose} title="Reset password" isOpen={isOpen}>
        <DialogBody>
          <Flex direction="column" alignItems="center" gap={2}>
            <Flex justifyContent="flex-start">
              <Typography>Send a password reset email.</Typography>
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
          endAction={<Button variant="danger-light">Send</Button>}
        />
      </Dialog>
    </>
  );
};
