import { Sort } from 'mongodb';

export type FilterSortPagination = {
  sort: Sort;
  skip: number;
  limit: number;
};
