import React, { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Flex,
  Typography,
  Button,
} from "@strapi/design-system";
import { TextInput } from "@strapi/design-system";

interface ResetPasswordProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onConfirm: (newPassword: string) => void;
}

export const ResetPassword = ({
  isOpen,
  email,
  onClose,
  onConfirm,
}: ResetPasswordProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [isNewPasswordChange, setIsNewPasswordChanged] = useState(false);

  const resetState = () => {
    setNewPassword("");
    setIsNewPasswordChanged(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleConfirm = () => {
    resetState();
    onConfirm(newPassword);
  };
  return (
    <>
      <Dialog onClose={handleClose} title="Reset password" isOpen={isOpen}>
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
            <div style={{ marginTop: 10 }}>
              <TextInput
                type="password"
                label="New password"
                aria-label="Password"
                value={newPassword}
                onChange={(e: any) => {
                  setIsNewPasswordChanged(true);
                  setNewPassword(e.target.value);
                }}
                required
                error={
                  !isNewPasswordChange
                    ? ""
                    : !newPassword
                    ? "Password is required"
                    : newPassword.length < 6
                    ? "Password must contain at least 6 characters"
                    : ""
                }
              />
            </div>
            <div></div>
          </Flex>
        </DialogBody>
        <DialogFooter
          startAction={
            <Button onClick={handleClose} variant="tertiary">
              Cancel
            </Button>
          }
          endAction={
            <Button
              variant="danger-light"
              disabled={newPassword === "" || newPassword.length < 6}
              onClick={handleConfirm}
            >
              Reset password
            </Button>
          }
        />
      </Dialog>
    </>
  );
};
