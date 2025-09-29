import { blogCollection } from '../../../../db/mongo.db';
import { BlogQueryRepository } from '../../repositories/blogQueryRepository';
import { queryParamsDto } from '../../repositories/dto/queryBlogDto';
import { BlogsViewModel } from '../../models/BlogsViewModel';
import { BlogQueryMapper } from './BlogQueryMapper';
import { BlogMapper } from './BlogMapper';
import { FilterSortPagination } from './entitiesQuery';
import { BlogModel } from '../../models/Blog';
import { ObjectId } from 'mongodb';

export class BlogQueryRepositoryImpl implements BlogQueryRepository {
  async getAll(query: queryParamsDto): Promise<BlogsViewModel> {
    const queryResult = BlogQueryMapper.toDomainDefault(query);
    const queryParams: FilterSortPagination = BlogQueryMapper.toEntity(queryResult);

    const blogs = await blogCollection
      .find(queryParams.filter)
      .sort(queryParams.sort)
      .skip(queryParams.skip)
      .limit(queryParams.limit)
      .toArray();
    const count = await blogCollection.countDocuments(queryParams.filter);

    return BlogQueryMapper.toDomain(
      queryResult,
      count,
      blogs.map(BlogMapper.toDomain)
    );
  }

  async getBlogsCount(filter: object): Promise<number> {
    return blogCollection.countDocuments(filter);
  }

  async getBlogById(id: string): Promise<BlogModel | null> {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });
    return blog ? BlogMapper.toDomain(blog) : null;
  }
}

export const blogQueryRepository = new BlogQueryRepositoryImpl();
