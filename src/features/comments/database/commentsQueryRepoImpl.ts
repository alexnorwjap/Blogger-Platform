import { CommentsQueryRepository } from '../repository/queryRepo';
import { FilterSortPagination } from './commentsEntity';
import { injectable } from 'inversify';
import { CommentDocument, CommentModelEntity } from './commentsEntity';

@injectable()
export class CommentsQueryRepoImpl implements CommentsQueryRepository {
  async getCommentById(id: string): Promise<CommentDocument | null> {
    return await CommentModelEntity.findById(id);
  }

  async getCommentsByPostId(
    postId: string,
    query: FilterSortPagination
  ): Promise<{ comments: CommentDocument[]; count: number }> {
    const commentsResult = CommentModelEntity.find({ postId })
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit);
    const countResult = CommentModelEntity.countDocuments({ postId });
    const [comments, count] = await Promise.all([commentsResult, countResult]);

    return {
      comments,
      count,
    };
  }
}
