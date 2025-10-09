import { UsersQueryRepository } from '../../../repositories/usersQueryRepository';
import { queryParamsDto } from '../../../repositories/dto/queryParamsDto';
import { UsersViewModel } from '../../../models/UsersViewModel';
import { UserQueryMapper } from '../mappers/UserQueryMapper';
import { userCollection } from '../../../../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { UserViewModel } from '../../../models/User';

class UsersQueryRepoImpl implements UsersQueryRepository {
  async getAll(query: queryParamsDto): Promise<UsersViewModel> {
    const queryResult = UserQueryMapper.toCheckDefault(query);
    const queryParams = UserQueryMapper.toFilterSortPagination(queryResult);
    const result = await userCollection
      .find(queryParams.filter)
      .sort(queryParams.sort)
      .skip(queryParams.skip)
      .limit(queryParams.limit)
      .toArray();

    const count = await userCollection.countDocuments(queryParams.filter);
    return UserQueryMapper.toDomainViewModel(queryResult, count, result.map(UserQueryMapper.toDomain));
  }
  async getUserById(id: ObjectId): Promise<UserViewModel | null> {
    const result = await userCollection.findOne({ _id: id });
    return result ? UserQueryMapper.toDomain(result) : null;
  }
}

export const usersQueryRepository = new UsersQueryRepoImpl();
