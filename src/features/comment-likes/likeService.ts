import { LikeCommentRepoImpl } from './database/likeRepoImpl';
import { createResult, Result } from '../../shared/utils/result-object';
import { injectable, inject } from 'inversify';
import { LikeCommentModel } from './database/likeEntity';

@injectable()
export class LikeCommentService {
  constructor(@inject(LikeCommentRepoImpl) readonly likeRepository: LikeCommentRepoImpl) {}

  async manageLike(
    userId: string,
    commentId: string,
    status: string
  ): Promise<Result<{ likesCount: number; dislikesCount: number } | null>> {
    const like = await this.likeRepository.getByUserIdAndCommentId({ userId, commentId });
    if (!like) {
      const newLike = LikeCommentModel.createLike(userId, commentId, status);
      await this.likeRepository.save(newLike);

      const countStatus = await this.likeRepository.getStatusByCommentId(commentId);
      return createResult('NO_CONTENT', countStatus);
    }
    if (like.status === status) {
      return createResult('NO_CONTENT', null);
    }

    like.updateStatus(status);
    await this.likeRepository.save(like);

    const countStatus = await this.likeRepository.getStatusByCommentId(commentId);
    return createResult('NO_CONTENT', countStatus);
  }

  async getStatusByUserAndCommentId(userId: string, commentId: string): Promise<string | null> {
    const result = await this.likeRepository.getByUserIdAndCommentId({ userId, commentId });
    return result ? result.status : null;
  }

  async getStatusesByUserAndCommentIds(
    userId: string,
    commentIds: string[]
  ): Promise<Map<string, string>> {
    const likes = await this.likeRepository.getLikesByUserIdAndCommentIds(userId, commentIds);
    const likesMap = new Map();
    likes.forEach(like => {
      likesMap.set(like.commentId, like.status);
    });
    return likesMap;
  }
}
