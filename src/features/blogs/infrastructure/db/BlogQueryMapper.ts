import { BlogModel } from '../../models/Blog';
import { queryParamsDto } from '../../repositories/dto/queryBlogDto';
import { BlogsViewModel } from '../../models/BlogsViewModel';
import { FilterSortPagination } from './entitiesQuery';

export class BlogQueryMapper {
  // in domain from bd
  public static toDomain(
    query: queryParamsDto,
    count: number,
    blogs: BlogModel[]
  ): BlogsViewModel {
    return {
      pagesCount: Math.ceil(count / +query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: count,
      items: blogs,
    };
  }

  public static toDomainDefault(query: queryParamsDto): queryParamsDto {
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
  public static toEntity(query: queryParamsDto): FilterSortPagination {
    return {
      filter: query.searchNameTerm
        ? { name: { $regex: query.searchNameTerm, $options: 'i' } }
        : {},
      sort: { [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 },
      skip: (+query.pageNumber - 1) * +query.pageSize,
      limit: +query.pageSize,
    };
  }
}
