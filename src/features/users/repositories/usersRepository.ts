import { UserViewModel } from '../models/User';
import { InputUserDto } from './dto/commandsUserDto';
import { Result } from '../../../shared/utils/result-object';

export interface UsersRepository {
  create: (dto: InputUserDto) => Promise<string | null>;
  delete: (id: string) => Promise<boolean>;
}
