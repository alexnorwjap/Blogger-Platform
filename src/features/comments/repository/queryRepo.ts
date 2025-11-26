import { CommentEntity, FilterSortPagination } from '../database/commentsEntity';
import { WithId } from 'mongodb';

export interface CommentsQueryRepository {
  getCommentById(id: string): Promise<WithId<CommentEntity> | null>;
  getCommentsByPostId(
    postId: string,
    query: FilterSortPagination
  ): Promise<{ comments: WithId<CommentEntity>[]; count: number }>;
}
