import { CommentsQueryRepository } from '../repository/queryRepo';
import { CommentViewModel, CommentsViewModel } from '../model/commentModel';
import { commentCollection } from '../../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { CommentQueryMapper } from './queryMapper';
import { queryParamsDto } from '../repository/repositoryDto';
import { injectable } from 'inversify';

@injectable()
export class CommentsQueryRepoImpl implements CommentsQueryRepository {
  async getCommentById(id: string): Promise<CommentViewModel | null> {
    const result = await commentCollection.findOne({ _id: new ObjectId(id) });
    return result ? CommentQueryMapper.toDomain(result) : null;
  }

  async getCommentByUserIdAndCommentId(commentId: string, userId: string): Promise<Boolean> {
    const result = await commentCollection.findOne({
      _id: new ObjectId(commentId),
      'commentatorInfo.userId': userId,
    });

    return result ? true : false;
  }

  // review complete
  async getCommentsByPostId(postId: string, query: queryParamsDto): Promise<CommentsViewModel> {
    const queryResult = CommentQueryMapper.toFilterSortPagination(query);
    const commentsResult = await commentCollection
      .find({ postId })
      .sort(queryResult.sort)
      .skip(queryResult.skip)
      .limit(queryResult.limit)
      .toArray();
    const countResult = await commentCollection.countDocuments({ postId });
    const [comments, count] = await Promise.all([commentsResult, countResult]);

    return CommentQueryMapper.toDomainViewModel(
      query,
      count,
      comments.map(CommentQueryMapper.toDomain)
    );
  }
}
