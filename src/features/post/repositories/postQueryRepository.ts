import { PostViewModel } from '../models/PostsViewModel';
import { queryParamsDto } from './dto/queryRepoPostDto';
import { PostsViewModel } from '../models/PostsViewModel';
import { NewestLikes } from '../database/entity/postEntities';

export interface PostQueryRepository {
  getAll(
    query: queryParamsDto,
    blogId?: string,
    statuses?: Map<string, string> | null,
    newestLikes?: { [postId: string]: NewestLikes[] } | null
  ): Promise<PostsViewModel>;
  getPostById(
    id: string,
    statuses: { [postId: string]: string } | null,
    newestLikes: { userId: string; login: string; addedAt: Date }[] | []
  ): Promise<PostViewModel | null>;
}
