import { CommentViewModel, CommentsViewModel } from '../model/commentModel';
import { queryParamsDto } from './repositoryDto';

export interface CommentsQueryRepository {
  getCommentById(id: string): Promise<CommentViewModel | null>;
  getCommentByUserIdAndCommentId(commentId: string, userId: string): Promise<Boolean>;
  getCommentsByPostId(postId: string, query: queryParamsDto): Promise<CommentsViewModel>;
}
