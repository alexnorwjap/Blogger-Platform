import { CommentsQueryRepository } from '../repository/queryRepo';
import { FilterSortPagination } from './commentQueryMapper';
import { injectable } from 'inversify';
import { CommentDocument, CommentModel } from './commentsEntity';

@injectable()
export class CommentsQueryRepoImpl implements CommentsQueryRepository {
  async getCommentById(id: string): Promise<CommentDocument | null> {
    return await CommentModel.findById(id);
  }

  async getCommentsByPostId(
    postId: string,
    query: FilterSortPagination
  ): Promise<{ comments: CommentDocument[]; count: number }> {
    const commentsResult = CommentModel.find({ postId })
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit);
    const countResult = CommentModel.countDocuments({ postId });
    const [comments, count] = await Promise.all([commentsResult, countResult]);

    return {
      comments,
      count,
    };
  }
}
