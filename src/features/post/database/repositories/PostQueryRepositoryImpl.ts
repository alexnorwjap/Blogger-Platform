import { PostQueryRepository } from '../../repositories/postQueryRepository';
import { queryParamsDto } from '../../repositories/dto/queryRepoPostDto';
import { PostsViewModel } from '../../models/PostsViewModel';
import { PostQueryMapper } from '../mappers/PostQueryMapper';
import { PostModel } from '../../models/Post';
import { injectable } from 'inversify';
import { PostModelEntity } from '../entity/postEntities';

@injectable()
export class PostQueryRepositoryImpl implements PostQueryRepository {
  async getAll(query: queryParamsDto, blogId?: string): Promise<PostsViewModel> {
    const { sort, skip, limit } = PostQueryMapper.toFilterSortPagination(query);
    const filter = blogId ? { blogId: blogId } : {};
    const postsResult = PostModelEntity.find(filter).sort(sort).skip(skip).limit(limit);
    const countResult = PostModelEntity.countDocuments(filter);
    const [posts, count] = await Promise.all([postsResult, countResult]);

    return PostQueryMapper.toDomainViewModel(
      query,
      count,
      posts.map(post => PostQueryMapper.toDomain(post.toObject()))
    );
  }

  async getPostById(id: string): Promise<PostModel | null> {
    const result = await PostModelEntity.findById(id);
    return result ? PostQueryMapper.toDomain(result.toObject()) : null;
  }
}
