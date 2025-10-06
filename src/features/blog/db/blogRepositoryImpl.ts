import { BlogModel } from '../models/Blog';
import { BlogRepository } from '../repositories/blogRepository';
import { BlogMapper } from './blogMapper';
import { blogCollection } from '../../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { BlogCreateDto, BlogUpdateDto } from '../repositories/dto/blogDto';

export class BlogRepositoryImpl implements BlogRepository {
  async create(dto: BlogCreateDto): Promise<BlogModel> {
    const result = await blogCollection.insertOne(dto);
    return BlogMapper.toDomain({
      _id: result.insertedId,
      ...dto,
    });
  }
  async update(id: string, dto: BlogUpdateDto): Promise<boolean> {
    const result = await blogCollection.updateOne({ _id: new ObjectId(id) }, { $set: { ...dto } });
    return result.modifiedCount > 0;
  }
  async delete(id: string): Promise<boolean> {
    const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}
