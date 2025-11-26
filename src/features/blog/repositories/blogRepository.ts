import { BlogDocument } from '../db/blogEntitiy';

export interface BlogRepository {
  save: (dto: BlogDocument) => Promise<string | null>;
  delete: (id: string) => Promise<boolean>;
  getBlogById: (id: string) => Promise<BlogDocument | null>;
}
