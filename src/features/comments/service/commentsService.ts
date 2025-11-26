import { CommentsRepositoryImpl } from '../database/commentsRepoImpl';
import { createResult, Result } from '../../../shared/utils/result-object';
import { inject, injectable } from 'inversify';
import { AuthDocument } from '../../auth/database/authEntity';
import { LikeService } from '../../like/likeService';
import { CommentModelEntity } from '../database/commentsEntity';

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepositoryImpl) readonly commentsRepository: CommentsRepositoryImpl,
    @inject(LikeService) readonly likesService: LikeService
  ) {}
  async updateComment(
    id: string,
    content: string,
    userId: string
  ): Promise<Result<boolean | null>> {
    const comment = await this.commentsRepository.getCommentById(id);
    if (!comment) return createResult('NOT_FOUND', null);

    if (comment.commentatorInfo.userId !== userId) return createResult('FORBIDDEN', null);

    // const isUserComment = await this.commentsRepository.getCommentByUserIdAndCommentId(id, userId);
    // if (!isUserComment) return createResult('FORBIDDEN', null);

    comment.content = content;
    await this.commentsRepository.save(comment);

    return createResult('NO_CONTENT', true);
  }

  async updateCommentLikesInfo(
    id: string,
    likesInfo: { likesCount: number; dislikesCount: number }
  ): Promise<Result<boolean>> {
    const comment = await this.commentsRepository.getCommentById(id);
    if (!comment) return createResult('NOT_FOUND', false);

    // const resultUpdate = await this.commentsRepository.updateCommentLikesInfo(id, likesInfo);
    // if (!resultUpdate) return createResult('NOT_FOUND', resultUpdate);
    comment.likesInfo.likesCount = likesInfo.likesCount;
    comment.likesInfo.dislikesCount = likesInfo.dislikesCount;
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
    user: AuthDocument
  ): Promise<Result<string | null>> {
    const comment = new CommentModelEntity({
      postId,
      content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
    });

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

    const resultManageLike = await this.likesService.manageLike(
      userId,
      commentId,
      likeStatus,
      comment.postId
    );

    if (resultManageLike.data !== null) {
      await this.updateCommentLikesInfo(commentId, resultManageLike.data);
    }

    return resultManageLike;
  }
}
