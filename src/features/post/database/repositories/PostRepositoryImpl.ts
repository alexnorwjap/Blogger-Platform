import { PostRepository } from '../../repositories/postRepository';
import { injectable } from 'inversify';
import { PostDocument } from '../entity/postEntities';
import { PostModel } from '../entity/postEntities';

@injectable()
export class PostRepositoryImpl implements PostRepository {
  async getPostsByBlogId(blogId: string): Promise<PostDocument[]> {
    return await PostModel.find({ blogId });
  }

  async getPostById(id: string): Promise<PostDocument | null> {
    const result = await PostModel.findById(id);
    return result ? result : null;
  }

  async save(post: PostDocument): Promise<string> {
    await post.save();
    return post.id;
  }

  async delete(id: string): Promise<boolean> {
    const result = await PostModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
