import { PostModel } from '../../../models/Post';
import { EntityCreate, EntityFromDb } from '../entity/entities';
import { AddPostDto } from '../../../repositories/dto/addPostDto';
import { UpdatePostDto } from '../../../repositories/dto/updatePostDto';
import { AddPostDtoByBlogId } from '../../../repositories/dto/addPostByBlogIdDto';

export class PostMapper {
  public static toDomain(entity: EntityFromDb): PostModel {
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

  public static CreateEntity(domainModel: AddPostDto, blogName: string): EntityCreate {
    return {
      title: domainModel.title,
      shortDescription: domainModel.shortDescription,
      content: domainModel.content,
      blogId: domainModel.blogId,
      blogName: blogName,
      createdAt: new Date(),
    };
  }
  public static CreateEntityByBlogId(
    domainModel: AddPostDtoByBlogId,
    blogName: string,
    blogId: string
  ): EntityCreate {
    return {
      title: domainModel.title,
      shortDescription: domainModel.shortDescription,
      content: domainModel.content,
      blogId: blogId,
      blogName: blogName,
      createdAt: new Date(),
    };
  }
}
