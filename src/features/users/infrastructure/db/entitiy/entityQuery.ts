import { ObjectId, Sort } from 'mongodb';

export type EntityFromDb = {
  _id: ObjectId;
  login: string;
  email: string;
  createdAt: Date;
};

export type UsersFilterSortPagination = {
  filter: object;
  sort: Sort;
  skip: number;
  limit: number;
};
