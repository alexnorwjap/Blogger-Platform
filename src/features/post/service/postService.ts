import { PostRepositoryImpl } from '../database/repositories/PostRepositoryImpl';
import { InputPostDtoByBlogId, InputPostDto } from './serviceDto';
import { UpdatePostDto } from '../repositories/dto/postRepoDto';
import { createResult } from '../../../shared/utils/result-object';
import { Result } from '../../../shared/utils/result-object';
import { inject, injectable } from 'inversify';

@injectable()
export class PostService {
  constructor(@inject(PostRepositoryImpl) readonly postRepository: PostRepositoryImpl) {}

  async createPost(dto: InputPostDto, blogName: string): Promise<Result<string | null>> {
    const newPost = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blogName,
      createdAt: new Date(),
    };
    const postId = await this.postRepository.create(newPost);
    if (!postId) return createResult('BAD_REQUEST', postId);

    return createResult('CREATED', postId);
  }

  async createPostByBlogId(
    dto: InputPostDtoByBlogId,
    blogName: string,
    blogId: string
  ): Promise<Result<string | null>> {
    const newPost = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blogId,
      blogName: blogName,
      createdAt: new Date(),
    };
    const postId = await this.postRepository.createByBlogId(newPost);
    if (!postId) return createResult('NOT_FOUND', postId);

    return createResult('CREATED', postId);
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<Result<boolean>> {
    const resultUpdate = await this.postRepository.update(id, dto);
    if (!resultUpdate) return createResult('NOT_FOUND', resultUpdate);

    return createResult('NO_CONTENT', resultUpdate);
  }

  async deletePost(id: string): Promise<Result<boolean>> {
    const resultDelete = await this.postRepository.delete(id);
    if (!resultDelete) return createResult('NOT_FOUND', resultDelete);

    return createResult('NO_CONTENT', resultDelete);
  }
}
