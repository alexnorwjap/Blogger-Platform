import { ObjectId, Sort } from 'mongodb';

export type EntityFromDb = {
  _id: ObjectId;
  login: string;
  email: string;
  createdAt: Date;
};

export type UsersFilterSortPagination = {
  filter: object;
  sort: { [key: string]: 1 | -1 };
  skip: number;
  limit: number;
};
