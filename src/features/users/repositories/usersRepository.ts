import { UserViewModel } from '../models/User';
import { CreateUserDto } from './dto/commandsUserDto';

export interface UsersRepository {
  create: (dto: CreateUserDto) => Promise<UserViewModel>;
  delete: (id: string) => Promise<boolean>;
  findByEmail: (email: string) => Promise<string | null>;
  findByLogin: (login: string) => Promise<string | null>;
}
