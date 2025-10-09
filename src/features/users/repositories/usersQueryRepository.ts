import { UsersViewModel } from '../models/UsersViewModel';
import { queryParamsDto } from './dto/queryParamsDto';
import { ObjectId } from 'mongodb';
import { UserViewModel } from '../models/User';

export interface UsersQueryRepository {
  getAll(query: queryParamsDto): Promise<UsersViewModel>;
  getUserById(id: ObjectId): Promise<UserViewModel | null>;
}
