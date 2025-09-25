import { Sort } from 'mongodb';

type Blog = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

type BlogMongoQuery = {
  filter: object;
  sort: Sort;
  skip: number;
  limit: number;
};

export { Blog, BlogMongoQuery };
