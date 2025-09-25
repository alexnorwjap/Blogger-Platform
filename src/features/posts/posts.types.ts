import { Sort } from 'mongodb';

type Post = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

type PostQueryParams = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: string;
  pageSize?: string;
};

type PostMongoQuery = {
  filter: object;
  sort: Sort;
  skip: number;
  limit: number;
};

export { Post, PostQueryParams, PostMongoQuery };
