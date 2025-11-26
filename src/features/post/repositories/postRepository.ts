import { PostDocument } from '../database/entity/postEntities';

export interface PostRepository {
  getPostById: (id: string) => Promise<PostDocument | null>;
  save: (post: PostDocument) => Promise<string | null>;
  delete: (id: string) => Promise<boolean>;
}
