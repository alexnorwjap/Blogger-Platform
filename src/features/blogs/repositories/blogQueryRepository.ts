import { BlogModel } from '../models/Blog';
import { queryParamsDto } from './dto/queryBlogDto';
import { BlogsViewModel } from '../models/BlogsViewModel';

export interface BlogQueryRepository {
  getAll(query: queryParamsDto): Promise<BlogsViewModel>;
  getBlogsCount(filter: object): Promise<number>;
  getBlogById(id: string): Promise<BlogModel | null>;
}
