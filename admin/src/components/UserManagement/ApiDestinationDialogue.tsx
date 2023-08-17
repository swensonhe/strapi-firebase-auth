import React, { useState } from "react";
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

interface ApiDestinationDialogueProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (isStrapiIncluded: boolean, isFirebaseIncluded: boolean) => void;
  title: string;
  submitText?: string;
}

export const ApiDestinationDialogue = ({
  isOpen,
  onClose,
  onSubmit,
  submitText = "Save",
  title,
}: ApiDestinationDialogueProps) => {
  const [isStrapiIncluded, setIsStrapiIncluded] = useState(false);
  const [isFirebaseIncluded, setIsFirebaseIncluded] = useState(false);
  return (
    <>
      <Dialog onClose={onClose} title={title} isOpen={isOpen}>
        <DialogBody>
          <Flex direction="column" alignItems="center" gap={2}>
            <Flex justifyContent="flex-start" textAlign="center">
              <Typography>Select destination</Typography>
            </Flex>
            <Flex justifyContent="flex-start" marginTop={2}>
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
                onSubmit(isStrapiIncluded, isFirebaseIncluded);
              }}
            >
              {submitText}
            </Button>
          }
        />
      </Dialog>
    </>
  );
};
