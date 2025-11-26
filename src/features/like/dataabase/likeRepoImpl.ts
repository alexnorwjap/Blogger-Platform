import { LikeChangeDto, LikeCreateDto, LikeFindDto } from '../repository/dto/likeRepositoryDto';
import { LikeRepository } from '../repository/likeRepository';
import { injectable } from 'inversify';
import { LikeDocument, LikeEntityDb, LikeModelEntity } from './likeEntity';

@injectable()
export class LikeRepoImpl implements LikeRepository {
  // async create(like: LikeCreateDto): Promise<boolean> {
  //   const result = await likeModel.create(like);
  //   return result._id ? true : false;
  // }
  // async update(like: LikeChangeDto): Promise<boolean> {
  //   const result = await likeModel.updateOne({ _id: like.likeId }, [
  //     {
  //       $set: {
  //         status: {
  //           $cond: {
  //             if: { $eq: ['$status', like.status] },
  //             then: 'None',
  //             else: like.status,
  //           },
  //         },
  //       },
  //     },
  //   ]);
  //   return result.modifiedCount > 0;
  // }
  async getByUserIdAndCommentId(dto: LikeFindDto): Promise<LikeDocument | null> {
    return await LikeModelEntity.findOne({ userId: dto.userId, commentId: dto.commentId });
  }

  async save(model: LikeDocument): Promise<LikeDocument> {
    return await model.save();
  }

  async getStatusByCommentId(
    commentId: string
  ): Promise<{ likesCount: number; dislikesCount: number }> {
    const countLike = await LikeModelEntity.countDocuments({ commentId, status: 'Like' });
    const countDislike = await LikeModelEntity.countDocuments({ commentId, status: 'Dislike' });

    const [likes, dislikes] = await Promise.all([countLike, countDislike]);
    return {
      likesCount: likes,
      dislikesCount: dislikes,
    };
  }

  async getLikesByPostId(postId: string, userId: string): Promise<LikeDocument[]> {
    return await LikeModelEntity.find({ postId, userId });
  }
}
