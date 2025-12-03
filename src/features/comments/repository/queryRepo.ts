import { Comment } from '../database/commentsEntity';
import { FilterSortPagination } from '../database/commentQueryMapper';
import { WithId } from 'mongodb';

export interface CommentsQueryRepository {
  getCommentById(id: string): Promise<WithId<Comment> | null>;
  getCommentsByPostId(
    postId: string,
    query: FilterSortPagination
  ): Promise<{ comments: WithId<Comment>[]; count: number }>;
}
