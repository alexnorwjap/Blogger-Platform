import { LikePostDocument } from '../database/postLikesEntity';

export interface PostLikeRepository {
  getStatusForPost: (postId: string, userId: string) => Promise<LikePostDocument | null>;
  getCountStatusByPostId: (
    postId: string
  ) => Promise<{ likesCount: number; dislikesCount: number }>;
  getNewestLikesForPost: (postId: string) => Promise<LikePostDocument[]>;
  getByUserIdAndPostId: (userId: string, postId: string) => Promise<LikePostDocument | null>;
  save: (like: LikePostDocument) => Promise<LikePostDocument>;
  getStatuses: (query: { userId: string; blogId?: string }) => Promise<LikePostDocument[]>;
  getNewestStatusesForPosts: (
    query:
      | {
          postId: { $in: string[] };
        }
      | {}
  ) => Promise<LikePostDocument[]>;
}
