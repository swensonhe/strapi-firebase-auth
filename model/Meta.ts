export interface Pagination {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

export interface ResponseMeta {
  pagination: Pagination;
}
