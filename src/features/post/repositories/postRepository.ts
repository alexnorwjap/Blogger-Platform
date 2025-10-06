import { PostModel } from '../models/Post';
import { CreatePostDto, UpdatePostDto } from './dto/postRepoDto';

export interface PostRepository {
  create: (dto: CreatePostDto) => Promise<PostModel>;
  createByBlogId: (dto: CreatePostDto) => Promise<PostModel>;
  update: (id: string, dto: UpdatePostDto) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
}
