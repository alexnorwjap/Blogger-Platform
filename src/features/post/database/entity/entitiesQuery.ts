export type FilterSortPagination = {
  sort: { [key: string]: 1 | -1 };
  skip: number;
  limit: number;
};
