import { BlogRepository } from '../repositories/blogRepository';
import { BlogRepositoryImpl } from '../db/blogRepositoryImpl';
import { InputBlogDto } from './blogServiceDto';
import { createBlog } from './blogBuilders';
import { createResult } from '../../../shared/utils/result-object';
import { Result } from '../../../shared/utils/result-object';

class BlogService {
  constructor(readonly blogRepository: BlogRepository) {}

  // review complete
  async createBlog(dto: InputBlogDto): Promise<Result<string | null>> {
    const blog = createBlog(dto);
    const blogId = await this.blogRepository.create(blog);
    if (!blogId) {
      return createResult('BAD_REQUEST', null, 'Blog not created');
    }
    return createResult('CREATED', blogId);
  }

  // review complete
  async updateBlog(id: string, dto: InputBlogDto): Promise<Result<boolean | null>> {
    const updateResult = await this.blogRepository.update(id, dto);
    if (!updateResult) {
      return createResult('NOT_FOUND', null, 'Blog not updated');
    }
    return createResult('NO_CONTENT', true);
  }

  // review complete
  async deleteBlog(id: string): Promise<Result<boolean | null>> {
    const deleteResult = await this.blogRepository.delete(id);
    if (!deleteResult) {
      return createResult('NOT_FOUND', null, 'Blog not deleted');
    }
    return createResult('NO_CONTENT', true);
  }
}

export const blogService = new BlogService(new BlogRepositoryImpl());
