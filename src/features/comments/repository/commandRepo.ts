import { CommentEntity } from '../database/entity';

export interface CommentsRepository {
  updateComment(id: string, content: string): Promise<boolean>;
  deleteComment(id: string): Promise<boolean>;
  createCommentByPostId(CommentEntity: CommentEntity): Promise<string | null>;
}
