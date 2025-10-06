import { BlogModel } from '../models/Blog';
import { BlogEntityDto } from './blogDto';
import { BlogEntity } from './entitiy';
import { WithId } from 'mongodb';

export class BlogMapper {
  public static toDomain(entity: WithId<BlogEntity>): BlogModel {
    return {
      id: entity._id.toString(),
      name: entity.name,
      description: entity.description,
      websiteUrl: entity.websiteUrl,
      createdAt: entity.createdAt.toISOString(),
      isMembership: entity.isMembership,
    };
  }

  public static toEntity(domainModel: BlogEntityDto): BlogEntity {
    return {
      name: domainModel.name,
      description: domainModel.description,
      websiteUrl: domainModel.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };
  }
}
