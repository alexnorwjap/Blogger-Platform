import { Sort } from 'mongodb';

export type CommentEntity = {
  content: string;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
};

export type FilterSortPagination = {
  sort: Sort;
  skip: number;
  limit: number;
};
