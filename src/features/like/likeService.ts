import { LikeRepoImpl } from './dataabase/likeRepoImpl';
import { createResult, Result } from '../../shared/utils/result-object';
import { injectable, inject } from 'inversify';
import { LikeModelEntity } from './dataabase/likeEntity';

@injectable()
export class LikeService {
  constructor(@inject(LikeRepoImpl) readonly likeRepository: LikeRepoImpl) {}

  async manageLike(
    userId: string,
    commentId: string,
    status: string,
    postId: string
  ): Promise<Result<{ likesCount: number; dislikesCount: number } | null>> {
    const like = await this.likeRepository.getByUserIdAndCommentId({ userId, commentId });
    if (!like) {
      const newLike = new LikeModelEntity({ userId, commentId, postId, status });
      await this.likeRepository.save(newLike);
      // const resultCreate = await this.createLike(userId, commentId, postId, status);
      // if (!resultCreate) return createResult('BAD_REQUEST', null);

      const countStatus = await this.likeRepository.getStatusByCommentId(commentId);
      return createResult('NO_CONTENT', countStatus);
    }
    if (like.status === status) {
      return createResult('NO_CONTENT', null);
    }
    like.status = status;
    await this.likeRepository.save(like);
    // const resultUpdate = await this.likeRepository.update({
    //   likeId: like._id.toString(),
    //   status: status,
    // });
    // if (!resultUpdate) return createResult('BAD_REQUEST', null);

    const countStatus = await this.likeRepository.getStatusByCommentId(commentId);
    return createResult('NO_CONTENT', countStatus);
  }

  // async createLike(
  //   userId: string,
  //   commentId: string,
  //   postId: string,
  //   status: string
  // ): Promise<boolean> {
  //   return await this.likeRepository.create({ userId, commentId, postId, status });
  // }

  async getLikesByPostId(postId: string, userId: string): Promise<Map<string, string>> {
    const likes = await this.likeRepository.getLikesByPostId(postId, userId);
    const likesMap = new Map();
    likes.forEach(like => {
      likesMap.set(like.commentId, like.status);
    });
    return likesMap;
  }

  async getStatusByUserAndCommentId(userId: string, commentId: string): Promise<string | null> {
    const result = await this.likeRepository.getByUserIdAndCommentId({ userId, commentId });
    return result ? result.status : null;
  }
}
