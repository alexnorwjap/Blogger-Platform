import { BlogModel } from '../models/Blog';
import { AddBlogDto } from './dto/addBlogDto';
import { UpdateBlogDto } from './dto/updateBlogDto';


export interface BlogRepository {
  create: (dto: AddBlogDto) => Promise<BlogModel>;
  update: (id: string, dto: UpdateBlogDto) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
}
