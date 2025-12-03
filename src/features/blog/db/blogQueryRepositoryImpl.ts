// import { blogCollection } from '../../../db/mongo.db';
import { BlogQueryRepository } from '../repositories/blogQueryRepository';
import { BlogViewModel, BlogsViewModel } from '../models/BlogsViewModel';
import { BlogQueryMapper } from './blogQueryMapper';
import { BlogMapper } from './blogMapper';
import { QueryParamsOutput } from '../router/helper/queryNormalize';
import { injectable } from 'inversify';
import { BlogModel } from './blogEntitiy';

@injectable()
export class BlogQueryRepositoryImpl implements BlogQueryRepository {
  async getAll(query: QueryParamsOutput): Promise<BlogsViewModel> {
    const { filter, sort, skip, limit } = BlogQueryMapper.toEntity(query);
    const blogsResult = BlogModel.find(filter).sort(sort).skip(skip).limit(limit);
    const countResult = BlogModel.countDocuments(filter);
    const [blogs, count] = await Promise.all([blogsResult, countResult]);

    return BlogQueryMapper.toDomain(
      query,
      count,
      blogs.map(blog => BlogMapper.toDomain(blog))
    );
  }

  async getBlogById(id: string): Promise<BlogViewModel | null> {
    const blog = await BlogModel.findById(id);
    return blog ? BlogMapper.toDomain(blog) : null;
  }
}
