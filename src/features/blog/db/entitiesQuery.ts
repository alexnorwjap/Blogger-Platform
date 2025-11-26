export type FilterSortPagination = {
  filter: object;
  sort: { [key: string]: 1 | -1 };
  skip: number;
  limit: number;
};
