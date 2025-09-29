import { PostModel } from '../../../models/Post';
import { PostsViewModel } from '../../../models/PostsViewModel';
import { queryParamsDto } from '../../../repositories/dto/queryPostDto';
import { EntityFromDb } from '../entity/entities';
import { FilterSortPagination } from '../entity/entitiesQuery';

export class PostQueryMapper {
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
  // in domain from bd
  public static toDomainViewModel(query: queryParamsDto, count: number, posts: PostModel[]): PostsViewModel {
    return {
      pagesCount: Math.ceil(count / +query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: count,
      items: posts,
    };
  }

  public static toCheckDefault(query: queryParamsDto): queryParamsDto {
    const {
      searchNameTerm = null,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = '1',
      pageSize = '10',
    } = query;
    return {
      searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    };
  }

  // in entity to bd
  public static toFilterSortPagination(query: queryParamsDto): FilterSortPagination {
    return {
      filter: query.searchNameTerm ? { name: { $regex: query.searchNameTerm, $options: 'i' } } : {},
      sort: { [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 },
      skip: (+query.pageNumber - 1) * +query.pageSize,
      limit: +query.pageSize,
    };
  }
}
