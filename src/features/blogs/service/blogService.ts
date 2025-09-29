import { BlogRepository } from '../repositories/blogRepository';
import { BlogRepositoryImpl } from '../infrastructure/db/BlogRepositoryImpl';
import { AddBlogDto } from '../repositories/dto/addBlogDto';
import { BlogModel } from '../models/Blog';
import { UpdateBlogDto } from '../repositories/dto/updateBlogDto';

class BlogService {
  constructor(readonly blogRepository: BlogRepository) {}

  async createBlog(dto: AddBlogDto): Promise<BlogModel> {
    return await this.blogRepository.create(dto);
  }

  async updateBlog(id: string, dto: UpdateBlogDto): Promise<boolean> {
    return await this.blogRepository.update(id, dto);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await this.blogRepository.delete(id);
  }
}

export const blogService = new BlogService(new BlogRepositoryImpl());
