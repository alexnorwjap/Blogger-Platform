import { BlogModel } from '../models/Blog';
import { BlogEntity } from './blogEntitiy';

export class BlogMapper {
  public static toDomain(entity: BlogEntity): BlogModel {
    return {
      id: entity._id.toString(),
      name: entity.name,
      description: entity.description,
      websiteUrl: entity.websiteUrl,
      createdAt: entity.createdAt.toISOString(),
      isMembership: entity.isMembership,
    };
  }
}
