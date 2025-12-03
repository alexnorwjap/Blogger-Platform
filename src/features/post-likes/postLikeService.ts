import { inject, injectable } from 'inversify';
import { PostLikesRepositoryImpl } from './database/postLikesRepositoryImpl';
import { UserDocument } from '../auth/database/userEntity';
import { LikePostModel } from './database/postLikesEntity';
import { LikePostDocument } from './database/postLikesEntity';

@injectable()
export class PostLikeService {
  constructor(
    @inject(PostLikesRepositoryImpl) readonly postLikesRepository: PostLikesRepositoryImpl
  ) {}

  async getStatusesForPost(
    postId: string,
    userId: string
  ): Promise<{ [postId: string]: string } | null> {
    const statuses = await this.postLikesRepository.getStatusForPost(postId, userId);
    if (!statuses) return null;
    return {
      [statuses.postId]: statuses.status,
    };
  }

  async getStatuses(query: { userId: string; blogId?: string }): Promise<LikePostDocument[]> {
    return await this.postLikesRepository.getStatuses(query);
  }

  async getNewestLikesForPost(
    postId: string
  ): Promise<{ userId: string; login: string; addedAt: Date }[] | []> {
    const newestLikes = await this.postLikesRepository.getNewestLikesForPost(postId);
    return newestLikes.length > 0
      ? newestLikes.map(like => ({
          userId: like.userId,
          login: like.login,
          addedAt: like.createdAt,
        }))
      : [];
  }

  async getNewestStatusesForPosts(postsIds: string[]): Promise<LikePostDocument[]> {
    const query = postsIds.length > 0 ? { postId: { $in: postsIds } } : {};
    return await this.postLikesRepository.getNewestStatusesForPosts(query);
  }

  async manageLike(
    postId: string,
    likeStatus: string,
    user: UserDocument
  ): Promise<{ likesCount: number; dislikesCount: number } | null> {
    const like = await this.postLikesRepository.getByUserIdAndPostId(user.id, postId);
    if (!like) {
      const newLike = LikePostModel.createLike(user.id, user.login, postId, likeStatus);
      await this.postLikesRepository.save(newLike);
      return this.postLikesRepository.getCountStatusByPostId(postId);
    }
    if (like.status === likeStatus) {
      return null;
    }
    like.updateStatus(likeStatus);
    await this.postLikesRepository.save(like);

    return this.postLikesRepository.getCountStatusByPostId(postId);
  }
}
