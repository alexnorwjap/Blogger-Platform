import { WithId } from 'mongodb';

type BlogId = {
  id: string;
};

type BlogQueryParams = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: string;
  pageSize?: string;
};

type BlogsViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogBodyOutput[];
};

type BlogBodyOutput = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

type BlogBodyInput = {
  name: string;
  description: string;
  websiteUrl: string;
};

type PostBodyInputForBlog = {
  title: string;
  shortDescription: string;
  content: string;
};

export {
  BlogId,
  BlogBodyOutput,
  BlogBodyInput,
  BlogQueryParams,
  BlogsViewModel,
  PostBodyInputForBlog,
};
