import { BlogRepository } from '../repositories/blogRepository';
import { injectable } from 'inversify';
import { BlogDocument } from './blogEntitiy';
import { BlogModelEntity } from './blogEntitiy';
@injectable()
export class BlogRepositoryImpl implements BlogRepository {
  async save(model: BlogDocument): Promise<string> {
    await model.save();
    return model.id;
  }
  async delete(id: string): Promise<boolean> {
    const result = await BlogModelEntity.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
  async getBlogById(id: string): Promise<BlogDocument | null> {
    const blog = await BlogModelEntity.findById(id);
    return blog;
  }
}
