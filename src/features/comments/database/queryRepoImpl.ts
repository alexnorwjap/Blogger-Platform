import { CommentsQueryRepository } from '../repository/queryRepo';
import { CommentModel, CommentViewModel, CommentsViewModel } from '../model/commentModel';
import { commentCollection } from '../../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { CommentQueryMapper } from './queryMapper';
import { queryParamsDto } from '../repository/repositoryDto';

class CommentsQueryRepoImpl implements CommentsQueryRepository {
  async getCommentById(id: string): Promise<CommentViewModel | null> {
    const result = await commentCollection.findOne({ _id: new ObjectId(id) });
    return result ? CommentQueryMapper.toDomain(result) : null;
  }
  async getCommentByUserIdAndCommentId(commentId: string, userId: ObjectId): Promise<Boolean> {
    const result = await commentCollection.findOne({
      _id: new ObjectId(commentId),
      'commentatorInfo.userId': userId.toString(),
    });
    console.log(result);
    return result ? true : false;
  }

  async getCommentsByPostId(postId: string, query: queryParamsDto): Promise<CommentsViewModel> {
    const queryResult = CommentQueryMapper.toFilterSortPagination(query);
    const result = await commentCollection
      .find({ postId })
      .sort(queryResult.sort)
      .skip(queryResult.skip)
      .limit(queryResult.limit)
      .toArray();

    const count = await commentCollection.countDocuments({ postId });
    return CommentQueryMapper.toDomainViewModel(query, count, result.map(CommentQueryMapper.toDomain));
  }
}

export const commentsQueryRepoImpl = new CommentsQueryRepoImpl();
