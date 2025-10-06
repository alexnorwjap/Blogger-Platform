import { PostRepository } from '../repositories/postRepository';
import { PostModel } from '../models/Post';
import { PostRepositoryImpl } from '../database/repositories/PostRepositoryImpl';
import { InputPostDtoByBlogId, InputPostDto } from './serviceDto';
import { createPost, createPostByBlogId } from './builders';
import { UpdatePostDto } from '../repositories/dto/postRepoDto';

class PostService {
  constructor(readonly postRepository: PostRepository) {}

  async createPost(dto: InputPostDto, blogName: string): Promise<PostModel> {
    const post = createPost(dto, blogName);
    return await this.postRepository.create(post);
  }

  async createPostByBlogId(dto: InputPostDtoByBlogId, blogName: string, blogId: string): Promise<PostModel> {
    const post = createPostByBlogId(dto, blogName, blogId);
    return await this.postRepository.createByBlogId(post);
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<boolean> {
    return await this.postRepository.update(id, dto);
  }

  async deletePost(id: string): Promise<boolean> {
    return await this.postRepository.delete(id);
  }
}

export const postService = new PostService(new PostRepositoryImpl());
