import { CreatePostDto, UpdatePostDto } from './dto/postRepoDto';

export interface PostRepository {
  create: (dto: CreatePostDto) => Promise<string | null>;
  createByBlogId: (dto: CreatePostDto) => Promise<string | null>;
  update: (id: string, dto: UpdatePostDto) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
}
