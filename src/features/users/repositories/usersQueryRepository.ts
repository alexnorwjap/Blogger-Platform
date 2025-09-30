import { UsersViewModel } from '../models/UsersViewModel';
import { queryParamsDto } from './dto/queryParamsDto';

export interface UsersQueryRepository {
  getAll(query: queryParamsDto): Promise<UsersViewModel>;
}
