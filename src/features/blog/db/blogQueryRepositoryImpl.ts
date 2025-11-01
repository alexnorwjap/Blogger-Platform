import { blogCollection } from '../../../db/mongo.db';
import { BlogQueryRepository } from '../repositories/blogQueryRepository';
import { BlogsViewModel } from '../models/BlogsViewModel';
import { BlogQueryMapper } from './blogQueryMapper';
import { BlogMapper } from './blogMapper';
import { FilterSortPagination } from './entitiesQuery';
import { BlogModel } from '../models/Blog';
import { ObjectId } from 'mongodb';
import { QueryParamsOutput } from '../router/helper/queryNormalize';

export class BlogQueryRepositoryImpl implements BlogQueryRepository {
  async getAll(query: QueryParamsOutput): Promise<BlogsViewModel> {
    const queryParams: FilterSortPagination = BlogQueryMapper.toEntity(query);
    const blogsResult = blogCollection
      .find(queryParams.filter)
      .sort(queryParams.sort)
      .skip(queryParams.skip)
      .limit(queryParams.limit)
      .toArray();
    const countResult = blogCollection.countDocuments(queryParams.filter);
    const [blogs, count] = await Promise.all([blogsResult, countResult]);

    return BlogQueryMapper.toDomain(query, count, blogs.map(BlogMapper.toDomain));
  }

  async getBlogById(id: string): Promise<BlogModel | null> {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });
    return blog ? BlogMapper.toDomain(blog) : null;
  }
}

export const blogQueryRepository = new BlogQueryRepositoryImpl();
