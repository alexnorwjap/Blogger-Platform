import { CommentDocument } from '../database/commentsEntity';

export interface CommentsRepository {
  deleteComment(id: string): Promise<boolean>;
  getCommentById(id: string): Promise<CommentDocument | null>;
  save(model: CommentDocument): Promise<CommentDocument>;
}
