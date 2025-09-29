import { BlogModel } from '../../models/Blog';
import { BlogRepository } from '../../repositories/blogRepository';
import { AddBlogDto } from '../../repositories/dto/addBlogDto';
import { UpdateBlogDto } from '../../repositories/dto/updateBlogDto';
import { BlogMapper } from './BlogMapper';
import { blogCollection } from '../../../../db/mongo.db';
import { ObjectId } from 'mongodb';

export class BlogRepositoryImpl implements BlogRepository {
  async create(dto: AddBlogDto): Promise<BlogModel> {
    const blog = BlogMapper.CreateEntity(dto);
    const result = await blogCollection.insertOne(blog);
    return BlogMapper.toDomain({
      _id: result.insertedId,
      ...blog,
    });
  }
  async update(id: string, dto: UpdateBlogDto): Promise<boolean> {
    const result = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...dto } }
    );
    return result.modifiedCount > 0;
  }
  async delete(id: string): Promise<boolean> {
    const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}
