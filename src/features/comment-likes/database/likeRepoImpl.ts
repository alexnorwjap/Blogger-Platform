import { LikeFindDto } from '../repository/dto/likeRepositoryDto';
import { LikeRepository } from '../repository/likeRepository';
import { injectable } from 'inversify';
import { LikeCommentDocument, LikeCommentModel } from './likeEntity';

@injectable()
export class LikeCommentRepoImpl implements LikeRepository {
  async getByUserIdAndCommentId(dto: LikeFindDto): Promise<LikeCommentDocument | null> {
    return await LikeCommentModel.findOne({ userId: dto.userId, commentId: dto.commentId });
  }

  async save(model: LikeCommentDocument): Promise<LikeCommentDocument> {
    return await model.save();
  }

  async getStatusByCommentId(
    commentId: string
  ): Promise<{ likesCount: number; dislikesCount: number }> {
    const countLike = await LikeCommentModel.countDocuments({ commentId, status: 'Like' });
    const countDislike = await LikeCommentModel.countDocuments({ commentId, status: 'Dislike' });

    const [likes, dislikes] = await Promise.all([countLike, countDislike]);
    return {
      likesCount: likes,
      dislikesCount: dislikes,
    };
  }

  async getLikesByUserIdAndCommentIds(
    userId: string,
    commentIds: string[]
  ): Promise<LikeCommentDocument[]> {
    return await LikeCommentModel.find({ userId, commentId: { $in: commentIds } });
  }
}
