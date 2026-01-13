interface PaginationMeta {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}

interface PaginationLinks {
  self: string;
  first: string;
  last: string;
  prev?: string;
  next?: string;
}