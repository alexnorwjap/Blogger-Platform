import { BlogRepositoryImpl } from '../db/blogRepositoryImpl';
import { InputBlogDto } from './blogServiceDto';
import { createResult } from '../../../shared/utils/result-object';
import { Result } from '../../../shared/utils/result-object';
import { inject, injectable } from 'inversify';

@injectable()
export class BlogService {
  constructor(@inject(BlogRepositoryImpl) readonly blogRepository: BlogRepositoryImpl) {}

  async createBlog(dto: InputBlogDto): Promise<Result<string | null>> {
    const newBlog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };
    const blogId = await this.blogRepository.create(newBlog);
    if (!blogId) return createResult('BAD_REQUEST', null);
    // на случай ошибки в бд?

    return createResult('CREATED', blogId);
  }

  async updateBlog(id: string, dto: InputBlogDto): Promise<Result<boolean>> {
    const updateResult = await this.blogRepository.update(id, dto);
    if (!updateResult) return createResult('NOT_FOUND', updateResult);

    return createResult('NO_CONTENT', updateResult);
  }

  async deleteBlog(id: string): Promise<Result<boolean>> {
    const deleteResult = await this.blogRepository.delete(id);
    if (!deleteResult) return createResult('NOT_FOUND', deleteResult);

    return createResult('NO_CONTENT', deleteResult);
  }
}
