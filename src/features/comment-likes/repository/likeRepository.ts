import { LikeComment, LikeCommentDocument } from '../database/likeEntity';
import { LikeFindDto } from './dto/likeRepositoryDto';

interface LikeRepository {
  getByUserIdAndCommentId: (dto: LikeFindDto) => Promise<LikeComment | null>;
  getStatusByCommentId: (
    commentId: string
  ) => Promise<{ likesCount: number; dislikesCount: number }>;
  getLikesByUserIdAndCommentIds: (userId: string, commentIds: string[]) => Promise<LikeComment[]>;
  save: (model: LikeCommentDocument) => Promise<LikeCommentDocument>;
}

export { LikeRepository };
