import React from "react";
import { Box } from "@strapi/design-system";
import { Flex } from "@strapi/design-system";
import { PaginationURLQuery, PageSizeURLQuery } from "@strapi/helper-plugin";

interface PaginationFooter {
  page?: number;
  pageCount?: number;
  pageSize?: number;
  total?: number;
}

export const PaginationFooter = ({
  pageCount = 0,
  pageSize = 0,
  total = 0,
}: PaginationFooter) => {
  return (
    <Box paddingTop={4}>
      <Flex alignItems="flex-end" justifyContent="space-between">
        <PageSizeURLQuery trackedEvent="willChangeNumberOfEntriesPerPage" />
        <PaginationURLQuery pagination={{ pageCount, pageSize, total }} />
      </Flex>
    </Box>
  );
};
