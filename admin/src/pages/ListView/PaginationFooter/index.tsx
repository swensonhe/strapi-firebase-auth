import React from "react";
import { Box } from "@strapi/design-system";
import { Flex } from "@strapi/design-system";
import { PaginationURLQuery, PageSizeURLQuery } from "@strapi/helper-plugin";

interface PaginationFooter {
  pageCount?: number;
}

export const PaginationFooter = ({ pageCount = 0 }: PaginationFooter) => {
  return (
    <Box paddingTop={4}>
      <Flex alignItems="flex-end" justifyContent="space-between">
        <PageSizeURLQuery />
        <PaginationURLQuery pagination={{ pageCount }} />
      </Flex>
    </Box>
  );
};
