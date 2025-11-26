import { CommentDocument, CommentEntity } from '../database/commentsEntity';

export interface CommentsRepository {
  // updateComment(id: string, content: string): Promise<boolean>;
  deleteComment(id: string): Promise<boolean>;
  // createCommentByPostId(comment: CommentEntity): Promise<string | null>;
  // getCommentById(id: string): Promise<CommentEntity | null>;
  // updateCommentLikesInfo(
  //   id: string,
  //   likesInfo: { likesCount: number; dislikesCount: number }
  // ): Promise<boolean>;
  // getCommentByUserIdAndCommentId(commentId: string, userId: string): Promise<Boolean>;
  save(model: CommentDocument): Promise<CommentDocument>;
}
