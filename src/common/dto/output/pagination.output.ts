export class PaginationOutput<T> {
  total: number;
  page: number;
  count: number;
  data: T[];
}

export class DataWithTotalCount<T> {
  total: number;
  data: T[];
}
