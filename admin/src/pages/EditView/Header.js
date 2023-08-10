import React from "react";
import { HeaderLayout } from "@strapi/design-system/Layout";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import { useHistory } from "react-router-dom";
import { Flex } from "@strapi/design-system/Flex";
import { Box } from "@strapi/design-system/Box";
import { Button } from "@strapi/design-system/Button";
import { Link } from "@strapi/design-system/Link";
import ArrowLeft from "@strapi/icons/ArrowLeft";

const Header = ({ title, onSave, initialData, modifiedData, isCreatingEntry, status }) => {
  const { goBack } = useHistory();
  const didChangeData = !isEqual(initialData, modifiedData) || (isCreatingEntry && !isEmpty(modifiedData));
  const primaryAction = (
    <Flex>
      <Box>
        <Button disabled={!didChangeData} onClick={onSave} loading={status === "submit-pending"} type="submit">
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
            onClick={e => {
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

export default Header;
