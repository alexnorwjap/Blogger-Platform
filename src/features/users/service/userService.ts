import { WrapValidErrorsType } from '../../../shared/types/errors-type';
import { UsersRepoImpl } from '../infrastructure/db/repositories/UsersRepoImpl';
import { UserViewModel } from '../models/User';
import { CreateUserDto } from '../repositories/dto/commandsUserDto';
import { UsersRepository } from '../repositories/usersRepository';
import bcrypt from 'bcryptjs';

class UserService {
  constructor(readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<UserViewModel | WrapValidErrorsType> {
    const existingLogin = await this.usersRepository.findByLogin(dto.login);
    const existingEmail = await this.usersRepository.findByEmail(dto.email);

    if (existingLogin || existingEmail) {
      return {
        errorsMessages: [
          {
            message: `${existingLogin ? 'Login' : 'Email'}  should be unique`,
            field: existingLogin ? 'Login' : 'Email',
          },
        ],
      };
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return await this.usersRepository.create({ ...dto, password: hashedPassword });
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.usersRepository.delete(id);
  }
}

export const userService = new UserService(new UsersRepoImpl());
