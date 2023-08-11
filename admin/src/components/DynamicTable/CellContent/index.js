import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Typography } from "@strapi/design-system/Typography";
import Media from "./Media";
import MultipleMedias from "./MultipleMedias";
import CellValue from "./CellValue";

const TypographyMaxWidth = styled(Typography)`
  max-width: 300px;
`;

const CellContent = ({
  content,
  fieldSchema,
  metadatas,
  name,
  queryInfos,
  rowId,
}) => {
  if (content === null || content === undefined) {
    return <Typography textColor="neutral800">-</Typography>;
  }

  if (fieldSchema.type === "icon") {
    return content;
  }

  if (fieldSchema.type === "media" && !fieldSchema.multiple) {
    return <Media {...content} />;
  }

  if (fieldSchema.type === "media" && fieldSchema.multiple) {
    return <MultipleMedias value={content} />;
  }

  return (
    <TypographyMaxWidth ellipsis textColor="neutral800">
      <CellValue type={fieldSchema.type} value={content} />
    </TypographyMaxWidth>
  );
};

CellContent.defaultProps = {
  content: undefined,
  queryInfos: undefined,
};

CellContent.propTypes = {
  content: PropTypes.any,
  fieldSchema: PropTypes.shape({
    multiple: PropTypes.bool,
    type: PropTypes.string.isRequired,
  }).isRequired,
  metadatas: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  rowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  queryInfos: PropTypes.shape({ endPoint: PropTypes.string.isRequired }),
};

export default CellContent;
