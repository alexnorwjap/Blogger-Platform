import { AddPostDto } from '../../../repositories/dto/addPostDto';
import { PostRepository } from '../../../repositories/postRepository';
import { PostModel } from '../../../models/Post';
import { AddPostDtoByBlogId } from '../../../repositories/dto/addPostByBlogIdDto';
import { PostMapper } from '../mappers/PostMapper';
import { postCollection } from '../../../../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { UpdatePostDto } from '../../../repositories/dto/updatePostDto';

export class PostRepositoryImpl implements PostRepository {
  async create(dto: AddPostDto, blogName: string): Promise<PostModel> {
    const post = PostMapper.CreateEntity(dto, blogName);
    const result = await postCollection.insertOne({ _id: new ObjectId(), ...post });
    return PostMapper.toDomain({ _id: result.insertedId, ...post });
  }
  async createByBlogId(dto: AddPostDtoByBlogId, blogName: string, blogId: string): Promise<PostModel> {
    const post = PostMapper.CreateEntityByBlogId(dto, blogName, blogId);
    const result = await postCollection.insertOne({ _id: new ObjectId(), ...post });
    return PostMapper.toDomain({ _id: result.insertedId, ...post });
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
