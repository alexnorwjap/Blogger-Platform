import { PostRepository } from './repositories/postRepository';
import { AddPostDto } from './repositories/dto/addPostDto';
import { PostModel } from './models/Post';
import { UpdatePostDto } from './repositories/dto/updatePostDto';
import { AddPostDtoByBlogId } from './repositories/dto/addPostByBlogIdDto';
import { PostRepositoryImpl } from './infrastructure/db/repositories/PostRepositoryImpl';

class PostService {
  constructor(readonly postRepository: PostRepository) {}

  async createPost(dto: AddPostDto, blogName: string): Promise<PostModel> {
    return await this.postRepository.create(dto, blogName);
  }

  async createPostByBlogId(dto: AddPostDtoByBlogId, blogName: string, blogId: string): Promise<PostModel> {
    return await this.postRepository.createByBlogId(dto, blogName, blogId);
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<boolean> {
    return await this.postRepository.update(id, dto);
  }

  async deletePost(id: string): Promise<boolean> {
    return await this.postRepository.delete(id);
  }
}

export const postService = new PostService(new PostRepositoryImpl());
