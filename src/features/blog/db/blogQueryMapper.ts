import { BlogModel } from '../models/Blog';
import { BlogsViewModel } from '../models/BlogsViewModel';
import { FilterSortPagination } from './entitiesQuery';
import { QueryParamsOutput } from '../router/helper/queryNormalize';

export class BlogQueryMapper {
  public static toDomain(query: QueryParamsOutput, count: number, blogs: BlogModel[]): BlogsViewModel {
    return {
      pagesCount: Math.ceil(count / +query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: count,
      items: blogs,
    };
  }

  public static toEntity(query: QueryParamsOutput): FilterSortPagination {
    return {
      filter: query.searchNameTerm ? { name: { $regex: query.searchNameTerm, $options: 'i' } } : {},
      sort: { [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 },
      skip: (+query.pageNumber - 1) * +query.pageSize,
      limit: +query.pageSize,
    };
  }
}
