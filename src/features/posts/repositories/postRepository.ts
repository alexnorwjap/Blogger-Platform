import { PostModel } from '../models/Post';
import { UpdatePostDto } from './dto/updatePostDto';
import { AddPostDto } from './dto/addPostDto';
import { AddPostDtoByBlogId } from './dto/addPostByBlogIdDto';

export interface PostRepository {
  create: (dto: AddPostDto, blogName: string) => Promise<PostModel>;
  createByBlogId: (dto: AddPostDtoByBlogId, blogName: string, blogId: string) => Promise<PostModel>;
  update: (id: string, dto: UpdatePostDto) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
}
