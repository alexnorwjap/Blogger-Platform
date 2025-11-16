import { PostRepository } from '../../repositories/postRepository';
import { CreatePostDto, UpdatePostDto } from '../../repositories/dto/postRepoDto';
import { postCollection } from '../../../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { injectable } from 'inversify';

@injectable()
export class PostRepositoryImpl implements PostRepository {
  async create(dto: CreatePostDto): Promise<string | null> {
    const result = await postCollection.insertOne({ _id: new ObjectId(), ...dto });
    return result.insertedId ? result.insertedId.toString() : null;
  }

  async createByBlogId(dto: CreatePostDto): Promise<string | null> {
    const result = await postCollection.insertOne({ _id: new ObjectId(), ...dto });
    return result.insertedId ? result.insertedId.toString() : null;
  }

  async update(id: string, dto: UpdatePostDto): Promise<boolean> {
    const result = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      }
    );
    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await postCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}
