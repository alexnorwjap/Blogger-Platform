import { PostLikeRepository } from '../repository/postLikeRepository';
import { injectable } from 'inversify';
import { LikePostDocument, LikePostModel } from './postLikesEntity';

@injectable()
export class PostLikesRepositoryImpl implements PostLikeRepository {
  async save(like: LikePostDocument): Promise<LikePostDocument> {
    return await like.save();
  }

  async getStatuses(query: { userId: string; blogId?: string }): Promise<LikePostDocument[]> {
    return await LikePostModel.find(query);
  }

  async getStatusForPost(postId: string, userId: string): Promise<LikePostDocument | null> {
    return await LikePostModel.findOne({ postId, userId });
  }

  async getNewestLikesForPost(postId: string): Promise<LikePostDocument[] | []> {
    return await LikePostModel.find({ postId, status: 'Like' }).sort({ createdAt: -1 }).limit(3);
  }

  async getNewestStatusesForPosts(
    query:
      | {
          postId: { $in: string[] };
        }
      | {}
  ): Promise<LikePostDocument[]> {
    return await LikePostModel.find({ status: 'Like', ...query }).sort({ createdAt: -1 });
  }

  async getByUserIdAndPostId(userId: string, postId: string): Promise<LikePostDocument | null> {
    return await LikePostModel.findOne({ userId, postId });
  }

  async getCountStatusByPostId(
    postId: string
  ): Promise<{ likesCount: number; dislikesCount: number }> {
    const countLike = LikePostModel.countDocuments({ postId, status: 'Like' });
    const countDislike = LikePostModel.countDocuments({ postId, status: 'Dislike' });
    const [likes, dislikes] = await Promise.all([countLike, countDislike]);
    return {
      likesCount: likes,
      dislikesCount: dislikes,
    };
  }
}
