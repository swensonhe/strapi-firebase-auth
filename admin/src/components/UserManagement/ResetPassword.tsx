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

interface ResetPasswordProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
}

export const ResetPassword = ({
  isOpen,
  email,
  onClose,
}: ResetPasswordProps) => {
  console.log("emailll", email);
  const [isStrapiIncluded, setIsStrapiIncluded] = useState(false);
  const [isFirebaseIncluded, setIsFirebaseIncluded] = useState(false);
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
            <Flex justifyContent="flex-start" textAlign="center" marginTop={2}>
              <Typography>Reset user in:</Typography>
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
              variant="danger-light"
              disabled={!isFirebaseIncluded && !isStrapiIncluded}
            >
              Send
            </Button>
          }
        />
      </Dialog>
    </>
  );
};
