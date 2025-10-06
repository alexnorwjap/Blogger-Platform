import { PostModel } from '../../models/Post';
import { PostEntity } from '../entity/entities';
import { WithId } from 'mongodb';

export class PostMapper {
  public static toDomain(entity: WithId<PostEntity>): PostModel {
    return {
      id: entity._id.toString(),
      title: entity.title,
      shortDescription: entity.shortDescription,
      content: entity.content,
      blogId: entity.blogId,
      blogName: entity.blogName,
      createdAt: entity.createdAt,
    };
  }
}
