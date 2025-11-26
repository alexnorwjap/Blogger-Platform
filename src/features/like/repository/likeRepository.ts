import { LikeEntityDb } from '../dataabase/likeEntity';
import { LikeFindDto, LikeChangeDto, LikeCreateDto } from './dto/likeRepositoryDto';

interface LikeRepository {
  // create: (like: LikeCreateDto) => Promise<boolean>;
  // update: (like: LikeChangeDto) => Promise<boolean>;
  getByUserIdAndCommentId: (dto: LikeFindDto) => Promise<LikeEntityDb | null>;
  getStatusByCommentId: (
    commentId: string
  ) => Promise<{ likesCount: number; dislikesCount: number }>;
  getLikesByPostId: (postId: string, userId: string) => Promise<LikeEntityDb[]>;
}

export { LikeRepository };
