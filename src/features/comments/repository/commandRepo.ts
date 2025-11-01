import { CommentEntity } from '../database/entity';

export interface CommandCommentsRepository {
  updateComment(id: string, content: string): Promise<boolean>;
  deleteComment(id: string): Promise<boolean>;
  createCommentByPostId(CommentEntity: CommentEntity): Promise<string>;
}
