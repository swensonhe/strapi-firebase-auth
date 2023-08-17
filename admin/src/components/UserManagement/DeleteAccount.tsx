import React, { useEffect, useState } from "react";
import { Box } from "@strapi/design-system";
import { Checkbox } from "@strapi/design-system";
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
  onDelete: (isStrapiIncluded: boolean, isFirebaseIncluded: boolean) => void;
}

export const DeleteAccount = ({
  isOpen,
  email,
  onClose,
  onDelete,
}: DeleteAccountProps) => {
  const [isStrapiIncluded, setIsStrapiIncluded] = useState(false);
  const [isFirebaseIncluded, setIsFirebaseIncluded] = useState(false);
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
            <Flex justifyContent="flex-start" textAlign="center" marginTop={2}>
              <Typography>Delete user from:</Typography>
            </Flex>
            <Flex justifyContent="flex-start">
              <Checkbox
                onValueChange={(value: boolean) => setIsStrapiIncluded(value)}
                value={isStrapiIncluded}
              >
                Strapi
              </Checkbox>

              <Box marginLeft={4}>
                <Checkbox
                  onValueChange={(value: boolean) =>
                    setIsFirebaseIncluded(value)
                  }
                  value={isFirebaseIncluded}
                >
                  Firebase
                </Checkbox>
              </Box>
            </Flex>
          </Flex>
        </DialogBody>
        <DialogFooter
          startAction={
            <Button onClick={onClose} variant="tertiary">
              Cancel
            </Button>
          }
          endAction={
            <Button
              variant="danger"
              onClick={() => {
                onDelete(isStrapiIncluded, isFirebaseIncluded);
              }}
            >
              Delete
            </Button>
          }
        />
      </Dialog>
    </>
  );
};
