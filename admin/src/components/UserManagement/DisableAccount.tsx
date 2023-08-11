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

interface DisableAccountProps {
  isOpen: boolean;
  email: boolean;
  onClose: () => void;
}

export const DisableAccount = ({
  isOpen,
  email,
  onClose,
}: DisableAccountProps) => {
  return (
    <>
      <Dialog onClose={onClose} title="Disable Account" isOpen={isOpen}>
        <DialogBody icon={<ExclamationMarkCircle />}>
          <Flex direction="column" alignItems="center" gap={2}>
            <Flex justifyContent="flex-start">
              <Typography textColor="danger700">
                Users with disabled accounts aren't able to sign in.
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
          endAction={<Button variant="danger">Disable</Button>}
        />
      </Dialog>
    </>
  );
};
