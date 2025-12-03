import { BlogViewModel } from '../models/BlogsViewModel';
import { BlogDocument } from './blogEntitiy';

export class BlogMapper {
  public static toDomain(entity: BlogDocument): BlogViewModel {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      websiteUrl: entity.websiteUrl,
      createdAt: entity.createdAt.toISOString(),
      isMembership: entity.isMembership,
    };
  }
}
