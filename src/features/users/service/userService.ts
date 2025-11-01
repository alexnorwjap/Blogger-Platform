import { WrapValidErrorsType } from '../../../shared/types/errors-type';
import { UsersRepoImpl } from '../infrastructure/db/repositories/UsersRepoImpl';
import { UserViewModel } from '../models/User';
import { CreateUserDto } from './userServiceDto';
import { UsersRepository } from '../repositories/usersRepository';
import bcrypt from 'bcryptjs';
import { Result } from '../../../shared/utils/result-object';
import { createResult } from '../../../shared/utils/result-object';

class UserService {
  constructor(readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<Result<string | null>> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const resultCreate = await this.usersRepository.create({
      ...dto,
      password: hashedPassword,
      createdAt: new Date(),
    });
    if (!resultCreate) {
      return createResult('BAD_REQUEST', null, 'User not created');
    }
    return createResult('CREATED', resultCreate);
  }

  async deleteUser(id: string): Promise<Result<boolean>> {
    const resultDelete = await this.usersRepository.delete(id);
    if (!resultDelete) {
      return createResult('NOT_FOUND', resultDelete, 'User not found');
    }
    return createResult('NO_CONTENT', resultDelete);
  }
}

export const userService = new UserService(new UsersRepoImpl());
