import React from "react";
import { HeaderLayout } from "@strapi/design-system";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import { useHistory } from "react-router-dom";
import { Flex } from "@strapi/design-system";
import { Box } from "@strapi/design-system";
import { Button } from "@strapi/design-system";
import { Link } from "@strapi/design-system";
import { ArrowLeft } from "@strapi/icons";
import { User } from "../../../../model/User";

interface HeaderProps {
  title: string;
  onSave: () => void;
  initialData: User | null;
  modifiedData: User | null;
  isCreatingEntry?: boolean;
  status?: string;
  isSubmitButtonDisabled?: boolean;
}

export const Header = ({
  title,
  onSave,
  initialData,
  modifiedData,
  isCreatingEntry = false,
  status = "",
  isSubmitButtonDisabled = false,
}: HeaderProps) => {
  const { goBack } = useHistory();
  const didChangeData =
    !isEqual(initialData, modifiedData) ||
    (isCreatingEntry && !isEmpty(modifiedData));
  const primaryAction = (
    <Flex>
      <Box>
        <Button
          disabled={!didChangeData || isSubmitButtonDisabled}
          onClick={onSave}
          loading={status === "submit-pending"}
          type="submit"
        >
          Save
        </Button>
      </Box>
    </Flex>
  );
  return (
    <>
      <HeaderLayout
        title={title}
        primaryAction={primaryAction}
        navigationAction={
          <Link
            startIcon={<ArrowLeft />}
            onClick={(e: any) => {
              e.preventDefault();
              goBack();
            }}
            to="/"
          >
            Back
          </Link>
        }
      />
    </>
  );
};
