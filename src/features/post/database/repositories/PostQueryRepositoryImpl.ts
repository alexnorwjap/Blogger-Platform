import { PostQueryRepository } from '../../repositories/postQueryRepository';
import { queryParamsDto } from '../../repositories/dto/queryRepoPostDto';
import { PostsViewModel } from '../../models/PostsViewModel';
import { postCollection } from '../../../../db/mongo.db';
import { PostQueryMapper } from '../mappers/PostQueryMapper';
import { ObjectId } from 'mongodb';
import { PostModel } from '../../models/Post';

class PostQueryRepositoryImpl implements PostQueryRepository {
  async getAll(query: queryParamsDto): Promise<PostsViewModel> {
    const queryParams = PostQueryMapper.toFilterSortPagination(query);
    const result = await postCollection
      .find({})
      .sort(queryParams.sort)
      .skip(queryParams.skip)
      .limit(queryParams.limit)
      .toArray();
    const count = await postCollection.countDocuments({});
    return PostQueryMapper.toDomainViewModel(query, count, result.map(PostQueryMapper.toDomain));
  }
  async getPostById(id: string): Promise<PostModel | null> {
    const result = await postCollection.findOne({ _id: new ObjectId(id) });
    return result ? PostQueryMapper.toDomain(result) : null;
  }
  async getAllPostsByBlogId(blogId: string, query: queryParamsDto): Promise<PostsViewModel> {
    const queryParams = PostQueryMapper.toFilterSortPagination(query);
    const result = await postCollection
      .find({ blogId: blogId })
      .sort(queryParams.sort)
      .skip(queryParams.skip)
      .limit(queryParams.limit)
      .toArray();
    const count = await postCollection.countDocuments({ blogId: blogId });
    return PostQueryMapper.toDomainViewModel(query, count, result.map(PostQueryMapper.toDomain));
  }
}

export const postQueryRepository = new PostQueryRepositoryImpl();
