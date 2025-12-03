import { UsersQueryRepository } from '../../../repositories/usersQueryRepository';
import { queryParamsDto } from '../../../repositories/dto/queryParamsDto';
import { UsersViewModel } from '../../../models/UsersViewModel';
import { UserQueryMapper } from '../mappers/UserQueryMapper';
import { UserViewModel } from '../../../models/User';
import { injectable } from 'inversify';
import { UserModel } from '../../../../auth/database/userEntity';

@injectable()
export class UsersQueryRepoImpl implements UsersQueryRepository {
  async getAll(query: queryParamsDto): Promise<UsersViewModel> {
    const queryResult = UserQueryMapper.toCheckDefault(query);
    const { filter, sort, skip, limit } = UserQueryMapper.toFilterSortPagination(queryResult);
    const result = await UserModel.find(filter).sort(sort).skip(skip).limit(limit);

    const count = await UserModel.countDocuments(filter);
    return UserQueryMapper.toDomainViewModel(
      queryResult,
      count,
      result.map(user => UserQueryMapper.toDomain(user))
    );
  }
  async getUserById(id: string): Promise<UserViewModel | null> {
    const result = await UserModel.findById(id);
    return result ? UserQueryMapper.toDomain(result) : null;
  }
}
