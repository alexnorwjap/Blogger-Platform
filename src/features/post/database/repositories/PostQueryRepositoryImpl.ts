import { PostQueryRepository } from '../../repositories/postQueryRepository';
import { queryParamsDto } from '../../repositories/dto/queryRepoPostDto';
import { PostsViewModel } from '../../models/PostsViewModel';
import { PostQueryMapper } from '../mappers/PostQueryMapper';
import { PostViewModel } from '../../models/PostsViewModel';
import { injectable } from 'inversify';
import { PostModel } from '../entity/postEntities';
import { NewestLikes } from '../entity/postEntities';

@injectable()
export class PostQueryRepositoryImpl implements PostQueryRepository {
  async getAll(
    query: queryParamsDto,
    blogId?: string | null,
    statuses?: Map<string, string> | null,
    newestLikes?: { [postId: string]: NewestLikes[] } | null
  ): Promise<PostsViewModel> {
    const { sort, skip, limit } = PostQueryMapper.toFilterSortPagination(query);
    const filter = blogId ? { blogId: blogId } : {};
    const postsResult = PostModel.find(filter).sort(sort).skip(skip).limit(limit);
    const countResult = PostModel.countDocuments(filter);
    const [posts, count] = await Promise.all([postsResult, countResult]);

    return PostQueryMapper.toDomainViewModel(
      query,
      count,
      posts.map(post => {
        const postStatus = statuses?.get(post.id) || null;
        const postNewestLikes = newestLikes?.[post.id] || [];
        return PostQueryMapper.toDomain(post, postStatus, postNewestLikes);
      })
    );
  }

  async getPostById(
    id: string,
    statuses: { [postId: string]: string } | null,
    newestLikes: { userId: string; login: string; addedAt: Date }[] | []
  ): Promise<PostViewModel | null> {
    const post = await PostModel.findById(id);
    return post ? PostQueryMapper.toDomain(post, statuses?.[id] || null, newestLikes) : null;
  }
}
