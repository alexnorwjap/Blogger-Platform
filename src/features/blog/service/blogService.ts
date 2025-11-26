import { BlogRepositoryImpl } from '../db/blogRepositoryImpl';
import { InputBlogDto } from './blogServiceDto';
import { createResult } from '../../../shared/utils/result-object';
import { Result } from '../../../shared/utils/result-object';
import { inject, injectable } from 'inversify';
import { InputPostDto } from '../../post/service/serviceDto';
import { PostService } from '../../post/service/postService';
import { BlogModelEntity } from '../db/blogEntitiy';
@injectable()
export class BlogService {
  constructor(
    @inject(BlogRepositoryImpl) readonly blogRepository: BlogRepositoryImpl,
    @inject(PostService) readonly postService: PostService
  ) {}

  async createBlog(dto: InputBlogDto): Promise<Result<string>> {
    const newBlog = new BlogModelEntity({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });
    const blogId = await this.blogRepository.save(newBlog);
    return createResult('CREATED', blogId);
  }

  async updateBlog(id: string, dto: InputBlogDto): Promise<Result<boolean>> {
    const blog = await this.blogRepository.getBlogById(id);
    if (!blog) return createResult('NOT_FOUND', false);
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    await this.blogRepository.save(blog);
    return createResult('NO_CONTENT', true);
  }

  async deleteBlog(id: string): Promise<Result<boolean>> {
    const deleteResult = await this.blogRepository.delete(id);
    if (!deleteResult) return createResult('NOT_FOUND', deleteResult);

    return createResult('NO_CONTENT', deleteResult);
  }

  async createPostForBlog(dto: InputPostDto, blogName: string): Promise<Result<string | null>> {
    const newPostId = await this.postService.createPost(dto, blogName);
    if (!newPostId.data) return createResult('BAD_REQUEST', null);

    return createResult('CREATED', newPostId.data);
  }
}
