import { PostRepository } from '../repositories/postRepository';
import { PostModel } from '../models/Post';
import { PostRepositoryImpl } from '../database/repositories/PostRepositoryImpl';
import { InputPostDtoByBlogId, InputPostDto } from './serviceDto';
import { createPost, createPostByBlogId } from './builders';
import { UpdatePostDto } from '../repositories/dto/postRepoDto';
import { createResult } from '../../../shared/utils/result-object';
import { Result } from '../../../shared/utils/result-object';

class PostService {
  constructor(readonly postRepository: PostRepository) {}

  // review complete
  async createPost(dto: InputPostDto, blogName: string): Promise<Result<string | null>> {
    const post = createPost(dto, blogName);
    const postId = await this.postRepository.create(post);
    if (!postId) {
      return createResult('BAD_REQUEST', null, 'Post not created');
    }
    return createResult('CREATED', postId);
  }

  // review complete
  async createPostByBlogId(
    dto: InputPostDtoByBlogId,
    blogName: string,
    blogId: string
  ): Promise<Result<string | null>> {
    const post = createPostByBlogId(dto, blogName, blogId);
    const postId = await this.postRepository.createByBlogId(post);
    if (!postId) {
      return createResult('NOT_FOUND', null, 'Post not created');
    }
    return createResult('CREATED', postId);
  }

  // review complete
  async updatePost(id: string, dto: UpdatePostDto): Promise<Result<boolean | null>> {
    const resultUpdate = await this.postRepository.update(id, dto);
    if (!resultUpdate) {
      return createResult('NOT_FOUND', null, 'Post not updated');
    }
    return createResult('NO_CONTENT', resultUpdate);
  }

  // review complete
  async deletePost(id: string): Promise<Result<boolean | null>> {
    const resultDelete = await this.postRepository.delete(id);
    if (!resultDelete) {
      return createResult('NOT_FOUND', null, 'Post not deleted');
    }
    return createResult('NO_CONTENT', resultDelete);
  }
}

export const postService = new PostService(new PostRepositoryImpl());
