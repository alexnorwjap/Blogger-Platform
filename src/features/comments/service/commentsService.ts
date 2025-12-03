import { CommentsRepositoryImpl } from '../database/commentsRepoImpl';
import { createResult, Result } from '../../../shared/utils/result-object';
import { inject, injectable } from 'inversify';
import { UserDocument } from '../../auth/database/userEntity';
import { LikeCommentService } from '../../comment-likes/likeService';
import { CommentModel } from '../database/commentsEntity';

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepositoryImpl) readonly commentsRepository: CommentsRepositoryImpl,
    @inject(LikeCommentService) readonly likesService: LikeCommentService
  ) {}
  async updateComment(
    id: string,
    content: string,
    userId: string
  ): Promise<Result<boolean | null>> {
    const comment = await this.commentsRepository.getCommentById(id);
    if (!comment) return createResult('NOT_FOUND', null);

    if (comment.commentatorInfo.userId !== userId) return createResult('FORBIDDEN', null);

    comment.updateComment(content);
    await this.commentsRepository.save(comment);

    return createResult('NO_CONTENT', true);
  }

  async updateCommentLikesInfo(
    id: string,
    likesInfo: { likesCount: number; dislikesCount: number }
  ): Promise<Result<boolean>> {
    const comment = await this.commentsRepository.getCommentById(id);
    if (!comment) return createResult('NOT_FOUND', false);

    comment.updateLike(likesInfo);
    await this.commentsRepository.save(comment);

    return createResult('NO_CONTENT', true);
  }

  async deleteComment(id: string, userId: string): Promise<Result<boolean | null>> {
    const comment = await this.commentsRepository.getCommentById(id);
    if (!comment) return createResult('NOT_FOUND', null);

    if (comment.commentatorInfo.userId !== userId) return createResult('FORBIDDEN', null);

    const resultDelete = await this.commentsRepository.deleteComment(id);
    if (!resultDelete) return createResult('NOT_FOUND', resultDelete);

    return createResult('NO_CONTENT', resultDelete);
  }

  async createCommentByPostId(
    postId: string,
    content: string,
    user: UserDocument
  ): Promise<Result<string | null>> {
    const comment = CommentModel.createComment(postId, content, user);

    await this.commentsRepository.save(comment);
    return createResult('CREATED', comment.id);
  }

  async changeLikeStatus(
    commentId: string,
    userId: string,
    likeStatus: string
  ): Promise<Result<{ likesCount: number; dislikesCount: number } | null>> {
    const comment = await this.commentsRepository.getCommentById(commentId);
    if (!comment) return createResult('NOT_FOUND', null);

    const resultManageLike = await this.likesService.manageLike(userId, commentId, likeStatus);

    if (resultManageLike.data !== null) {
      await this.updateCommentLikesInfo(commentId, resultManageLike.data);
    }

    return resultManageLike;
  }
}
