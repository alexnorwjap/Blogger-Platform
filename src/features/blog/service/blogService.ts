import { BlogRepository } from '../repositories/blogRepository';
import { BlogRepositoryImpl } from '../db/blogRepositoryImpl';
import { BlogModel } from '../models/Blog';
import { InputBlogDto } from './blogServiceDto';
import { createBlog } from './blogBuilders';

class BlogService {
  constructor(readonly blogRepository: BlogRepository) {}

  async createBlog(dto: InputBlogDto): Promise<BlogModel> {
    const blog = createBlog(dto);
    return await this.blogRepository.create(blog);
  }

  async updateBlog(id: string, dto: InputBlogDto): Promise<boolean> {
    return await this.blogRepository.update(id, dto);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await this.blogRepository.delete(id);
  }
}

export const blogService = new BlogService(new BlogRepositoryImpl());
