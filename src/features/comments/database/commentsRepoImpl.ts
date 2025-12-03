import { CommentsRepository } from '../repository/commandRepo';
import { CommentDocument, CommentModel } from './commentsEntity';
import { injectable } from 'inversify';

@injectable()
export class CommentsRepositoryImpl implements CommentsRepository {
  async deleteComment(id: string): Promise<boolean> {
    const result = await CommentModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async getCommentById(id: string): Promise<CommentDocument | null> {
    return await CommentModel.findById(id);
  }

  async save(model: CommentDocument): Promise<CommentDocument> {
    return await model.save();
  }
}
