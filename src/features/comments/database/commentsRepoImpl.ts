import { CommentsRepository } from '../repository/commandRepo';
import { CommentDocument, CommentModelEntity } from './commentsEntity';
import { injectable } from 'inversify';

@injectable()
export class CommentsRepositoryImpl implements CommentsRepository {
  // async updateComment(id: string, content: string): Promise<boolean> {
  //   const result = await commentModel.updateOne({ _id: id }, { $set: { content } });
  //   return result.modifiedCount > 0;
  // }
  // async updateCommentLikesInfo(
  //   id: string,
  //   likesInfo: { likesCount: number; dislikesCount: number }
  // ): Promise<boolean> {
  //   const result = await commentModel.updateOne({ _id: id }, { $set: { likesInfo } });
  //   return result.modifiedCount > 0;
  // }

  // async getCommentByUserIdAndCommentId(commentId: string, userId: string): Promise<Boolean> {
  //   const result = await commentModel.findOne({
  //     _id: commentId,
  //     'commentatorInfo.userId': userId,
  //   });
  //   return result ? true : false;
  // }

  async deleteComment(id: string): Promise<boolean> {
    const result = await CommentModelEntity.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
  // async createCommentByPostId(comment: CommentEntity): Promise<string | null> {
  //   const result = await commentModel.create(comment);
  //   return result._id ? result._id.toString() : null;
  // }
  async getCommentById(id: string): Promise<CommentDocument | null> {
    return await CommentModelEntity.findById(id);
  }

  async save(model: CommentDocument): Promise<CommentDocument> {
    return await model.save();
  }
}
