import { BlogModel } from '../../models/Blog';
import { EntityCreate, EntityFromDb } from './entities';
import { AddBlogDto } from '../../repositories/dto/addBlogDto';
import { UpdateBlogDto } from '../../repositories/dto/updateBlogDto';

export class BlogMapper {
  public static toDomain(entity: EntityFromDb): BlogModel {
    return {
      id: entity._id.toString(),
      name: entity.name,
      description: entity.description,
      websiteUrl: entity.websiteUrl,
      createdAt: entity.createdAt,
      isMembership: entity.isMembership,
    };
  }

  public static CreateEntity(domainModel: AddBlogDto): EntityCreate {
    return {
      name: domainModel.name,
      description: domainModel.description,
      websiteUrl: domainModel.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };
  }
}
