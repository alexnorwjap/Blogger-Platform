import { PostModel } from '../../models/Post';
import { PostsViewModel } from '../../models/PostsViewModel';
import { FilterSortPagination } from '../entity/entitiesQuery';
import { PostEntity } from '../entity/postEntities';
import { queryParamsDto } from '../../repositories/dto/queryRepoPostDto';
import { WithId } from 'mongodb';

export class PostQueryMapper {
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

  public static toDomainViewModel(
    query: queryParamsDto,
    count: number,
    posts: PostModel[]
  ): PostsViewModel {
    return {
      pagesCount: Math.ceil(count / +query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: count,
      items: posts,
    };
  }

  public static toFilterSortPagination(query: queryParamsDto): FilterSortPagination {
    return {
      sort: { [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 },
      skip: (+query.pageNumber - 1) * +query.pageSize,
      limit: +query.pageSize,
    };
  }
}
