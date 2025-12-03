import { UserViewModel } from '../../../models/User';
import { queryParamsDto } from '../../../repositories/dto/queryParamsDto';
import { UserDocument } from '../../../../auth/database/userEntity';
import { UsersViewModel } from '../../../models/UsersViewModel';

type UsersFilterSortPagination = {
  filter: object;
  sort: { [key: string]: 1 | -1 };
  skip: number;
  limit: number;
};

export class UserQueryMapper {
  public static toDomain(entity: UserDocument): UserViewModel {
    return {
      id: entity.id,
      login: entity.login,
      email: entity.email,
      createdAt: entity.createdAt,
    };
  }

  public static toDomainViewModel(
    query: queryParamsDto,
    count: number,
    users: UserViewModel[]
  ): UsersViewModel {
    return {
      pagesCount: Math.ceil(count / +query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: count,
      items: users,
    };
  }

  public static toCheckDefault(query: queryParamsDto): queryParamsDto {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = '1',
      pageSize = '10',
      searchLoginTerm = null,
      searchEmailTerm = null,
    } = query;
    return {
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    };
  }

  public static toFilterSortPagination(query: queryParamsDto): UsersFilterSortPagination {
    return {
      filter: {
        ...((query.searchLoginTerm || query.searchEmailTerm) && {
          $or: [
            ...(query.searchLoginTerm
              ? [{ login: { $regex: query.searchLoginTerm, $options: 'i' } }]
              : []),
            ...(query.searchEmailTerm
              ? [{ email: { $regex: query.searchEmailTerm, $options: 'i' } }]
              : []),
          ],
        }),
      },
      sort: { [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 },
      skip: (+query.pageNumber - 1) * +query.pageSize,
      limit: +query.pageSize,
    };
  }
}
