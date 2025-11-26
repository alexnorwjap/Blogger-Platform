import { UsersQueryRepository } from '../../../repositories/usersQueryRepository';
import { queryParamsDto } from '../../../repositories/dto/queryParamsDto';
import { UsersViewModel } from '../../../models/UsersViewModel';
import { UserQueryMapper } from '../mappers/UserQueryMapper';
import { UserViewModel } from '../../../models/User';
import { injectable } from 'inversify';
import { userModel } from '../../../../../db/mongo.db';

@injectable()
export class UsersQueryRepoImpl implements UsersQueryRepository {
  async getAll(query: queryParamsDto): Promise<UsersViewModel> {
    const queryResult = UserQueryMapper.toCheckDefault(query);
    const queryParams = UserQueryMapper.toFilterSortPagination(queryResult);
    const result = await userModel
      .find(queryParams.filter)
      .sort(queryParams.sort)
      .skip(queryParams.skip)
      .limit(queryParams.limit)
      .lean();

    const count = await userModel.countDocuments(queryParams.filter);
    return UserQueryMapper.toDomainViewModel(
      queryResult,
      count,
      result.map(UserQueryMapper.toDomain)
    );
  }
  async getUserById(id: string): Promise<UserViewModel | null> {
    try {
      const result = await userModel.findById(id).lean();
      return result ? UserQueryMapper.toDomain(result) : null;
    } catch (error) {
      return null;
    }
  }

  async findByLoginOrEmail(login: string, email: string): Promise<UserViewModel | null> {
    try {
      const result = await userModel.findOne({ $or: [{ login }, { email }] }).lean();
      return result ? UserQueryMapper.toDomain(result) : null;
    } catch (error) {
      return null;
    }
  }
}
