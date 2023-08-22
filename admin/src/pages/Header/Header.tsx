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

interface HeaderProps {
  title: string;
  onSave: () => void;
  initialData: any;
  modifiedData: any;
  isCreatingEntry?: boolean;
  status?: string;
}

export const Header = ({
  title,
  onSave,
  initialData,
  modifiedData,
  isCreatingEntry = false,
  status = "",
}: HeaderProps) => {
  const { goBack } = useHistory();
  const didChangeData =
    !isEqual(initialData, modifiedData) ||
    (isCreatingEntry && !isEmpty(modifiedData));
  const primaryAction = (
    <Flex>
      <Box>
        <Button
          disabled={!didChangeData}
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
