import { PostQueryRepository } from '../../repositories/postQueryRepository';
import { queryParamsDto } from '../../repositories/dto/queryRepoPostDto';
import { PostsViewModel } from '../../models/PostsViewModel';
import { postCollection } from '../../../../db/mongo.db';
import { PostQueryMapper } from '../mappers/PostQueryMapper';
import { ObjectId } from 'mongodb';
import { PostModel } from '../../models/Post';

// review complete
class PostQueryRepositoryImpl implements PostQueryRepository {
  // review complete
  async getAll(query: queryParamsDto): Promise<PostsViewModel> {
    const queryParams = PostQueryMapper.toFilterSortPagination(query);
    const postsResult = postCollection
      .find({})
      .sort(queryParams.sort)
      .skip(queryParams.skip)
      .limit(queryParams.limit)
      .toArray();
    const countResult = postCollection.countDocuments({});
    const [posts, count] = await Promise.all([postsResult, countResult]);

    return PostQueryMapper.toDomainViewModel(query, count, posts.map(PostQueryMapper.toDomain));
  }
  // review complete
  async getPostById(id: string): Promise<PostModel | null> {
    const result = await postCollection.findOne({ _id: new ObjectId(id) });
    return result ? PostQueryMapper.toDomain(result) : null;
  }
  // review complete
  async getAllPostsByBlogId(blogId: string, query: queryParamsDto): Promise<PostsViewModel> {
    const queryParams = PostQueryMapper.toFilterSortPagination(query);
    const postsResult = postCollection
      .find({ blogId: blogId })
      .sort(queryParams.sort)
      .skip(queryParams.skip)
      .limit(queryParams.limit)
      .toArray();
    const countResult = postCollection.countDocuments({ blogId: blogId });
    const [posts, count] = await Promise.all([postsResult, countResult]);

    return PostQueryMapper.toDomainViewModel(query, count, posts.map(PostQueryMapper.toDomain));
  }
}

export const postQueryRepository = new PostQueryRepositoryImpl();
