import { BlogRepository } from '../repositories/blogRepository';
import { injectable } from 'inversify';
import { BlogDocument } from './blogEntitiy';
import { BlogModel } from './blogEntitiy';
@injectable()
export class BlogRepositoryImpl implements BlogRepository {
  async save(model: BlogDocument): Promise<void> {
    await model.save();
  }
  async delete(id: string): Promise<boolean> {
    const result = await BlogModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
  async getBlogById(id: string): Promise<BlogDocument | null> {
    return await BlogModel.findById(id);
  }
}
