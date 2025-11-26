// import { blogCollection } from '../../../db/mongo.db';
import { BlogQueryRepository } from '../repositories/blogQueryRepository';
import { BlogsViewModel } from '../models/BlogsViewModel';
import { BlogQueryMapper } from './blogQueryMapper';
import { BlogMapper } from './blogMapper';
import { FilterSortPagination } from './entitiesQuery';
import { BlogModel } from '../models/Blog';
import { ObjectId } from 'mongodb';
import { QueryParamsOutput } from '../router/helper/queryNormalize';
import { injectable } from 'inversify';
import { BlogModelEntity } from './blogEntitiy';

@injectable()
export class BlogQueryRepositoryImpl implements BlogQueryRepository {
  async getAll(query: QueryParamsOutput): Promise<BlogsViewModel> {
    const { filter, sort, skip, limit } = BlogQueryMapper.toEntity(query);
    const blogsResult = BlogModelEntity.find(filter).sort(sort).skip(skip).limit(limit).lean();
    const countResult = BlogModelEntity.countDocuments(filter);
    const [blogs, count] = await Promise.all([blogsResult, countResult]);

    return BlogQueryMapper.toDomain(query, count, blogs.map(BlogMapper.toDomain));
  }

  async getBlogById(id: string): Promise<BlogModel | null> {
    const blog = await BlogModelEntity.findById(id);
    return blog ? BlogMapper.toDomain(blog.toObject()) : null;
  }
}
