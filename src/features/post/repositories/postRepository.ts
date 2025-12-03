import { PostDocument } from '../database/entity/postEntities';

export interface PostRepository {
  getPostsByBlogId: (blogId: string) => Promise<PostDocument[]>;
  getPostById: (id: string) => Promise<PostDocument | null>;
  save: (post: PostDocument) => Promise<string | null>;
  delete: (id: string) => Promise<boolean>;
}
