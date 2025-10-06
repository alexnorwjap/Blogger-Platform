import { Sort } from 'mongodb';

export type FilterSortPagination = {
  filter: object;
  sort: Sort;
  skip: number;
  limit: number;
};
