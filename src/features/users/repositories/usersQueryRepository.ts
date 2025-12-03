import { UsersViewModel } from '../models/UsersViewModel';
import { queryParamsDto } from './dto/queryParamsDto';
import { UserViewModel } from '../models/User';

export interface UsersQueryRepository {
  getAll(query: queryParamsDto): Promise<UsersViewModel>;
  getUserById(id: string): Promise<UserViewModel | null>;
}
