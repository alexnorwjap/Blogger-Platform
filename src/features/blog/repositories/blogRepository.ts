import { BlogModel } from '../models/Blog';
import { BlogCreateDto, BlogUpdateDto } from './dto/blogDto';

export interface BlogRepository {
  create: (dto: BlogCreateDto) => Promise<BlogModel>;
  update: (id: string, dto: BlogUpdateDto) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
}
