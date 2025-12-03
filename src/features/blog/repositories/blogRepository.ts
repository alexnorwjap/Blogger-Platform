import { BlogDocument } from '../db/blogEntitiy';

export interface BlogRepository {
  save: (dto: BlogDocument) => Promise<void>;
  delete: (id: string) => Promise<boolean>;
  getBlogById: (id: string) => Promise<BlogDocument | null>;
}
