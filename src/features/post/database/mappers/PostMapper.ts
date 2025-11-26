import { PostModel } from '../../models/Post';
import { PostEntity } from '../entity/postEntities';
import { WithId } from 'mongodb';

export class PostMapper {
  public static toDomain(entity: PostEntity): PostModel {
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
