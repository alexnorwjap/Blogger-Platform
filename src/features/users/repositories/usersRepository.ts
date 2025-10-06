import { UserViewModel } from '../models/User';
import { InputUserDto } from './dto/commandsUserDto';

export interface UsersRepository {
  create: (dto: InputUserDto) => Promise<UserViewModel>;
  delete: (id: string) => Promise<boolean>;
  findByEmail: (email: string) => Promise<string | null>;
  findByLogin: (login: string) => Promise<string | null>;
}
