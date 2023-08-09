import  utils from "@strapi/utils";
const { PaginationError } = utils.errors;

/**
 * @description Paginate data using start and limi flags
 * @access private
 * @param {Array} data
 * @param {Number} start
 * @param {Number} limit
 * @returns paginated data
 */
const ___paginateUsingStartLimit = (data, start, limit) => {
  const end = start + limit;
  return data.slice(start, end);
};

/**
 * @description Paginate data using page and pageSize
 * @access private
 * @param {Array} data
 * @param {Number} pageNumber
 * @param {Number} pageSize
 * @returns paginated data
 */
const ___paginateUsingPagePageSize = (data, pageNumber, pageSize) => {
  return data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};

/**
 * @description Calculate totalCount parameter
 * @access private
 * @param {Number} total
 * @param {Number} pageSize
 * @returns
 */

const ___calculatePageCount = (total, pageSize) => {
  return Math.ceil(total / pageSize);
};

/**
 * @description Perform pagination on array of data
 * @param {Array} data
 * @param {Object} pagination
 * @returns array after performing pagination on it and meta object
 */

export default  (data, pagination) => {
  let isPaginated = false;
  const total = data.length;

  if (!Array.isArray(data)) {
    throw new PaginationError(`Wrong data type expected Array recieved ${typeof data}`);
  }

  // If no pagination provided, use the default one
  if (!pagination) {
    pagination = {
      page: 1,
      pageSize: 25,
    };
  }

  const hasStart = "start" in pagination;
  const hasLimit = "limit" in pagination;

  if (hasStart && hasLimit) {
    pagination.start = Number(pagination.start);
    pagination.limit = Number(pagination.limit);
    isPaginated = true;
  }

  const hasPage = "page" in pagination;
  const hasPageSize = "pageSize" in pagination;
  const hasWithCount = "withCount" in pagination;

  if (hasPage && hasPageSize && !isPaginated) {
    pagination.page = Number(pagination.page);
    pagination.pageSize = Number(pagination.pageSize);
    if (!hasWithCount || pagination.withCount) {
      pagination.pageCount = ___calculatePageCount(total, pagination.pageSize);

      if (hasWithCount) {
        delete pagination.withCount;
      }
    }
    isPaginated = true;
  }

  if (!isPaginated) {
    throw new PaginationError("Wrong pagination query!");
  }

  return {
    meta: {
      pagination: {
        ...pagination,
        total,
      },
    },
  };
};
