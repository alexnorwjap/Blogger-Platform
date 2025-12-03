import { UsersRepoImpl } from '../infrastructure/db/repositories/UsersRepoImpl';
import { CreateUserDto } from './userServiceDto';
import { Result } from '../../../shared/utils/result-object';
import { createResult } from '../../../shared/utils/result-object';
import { inject, injectable } from 'inversify';
import { BcryptService } from '../../auth/adapter/bcryptService';
import { UserDocument, UserModel } from '../../auth/database/userEntity';

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepoImpl) readonly usersRepository: UsersRepoImpl,
    @inject(BcryptService) readonly bcryptService: BcryptService
  ) {}

  async createUser(dto: CreateUserDto): Promise<Result<string | null>> {
    const existingUser = await this.usersRepository.findByLoginOrEmail(dto.login, dto.email);
    if (existingUser) {
      const field = existingUser.login === dto.login ? 'login' : 'email';
      const message = `User with this ${field} already exists`;
      return createResult('BAD_REQUEST', null, 'errorsMessages', [{ field, message }]);
    }
    const hashedPassword = await this.bcryptService.hashPassword(dto.password);

    const newUser = UserModel.createUserAdmin(dto, hashedPassword);
    await this.usersRepository.save(newUser);

    return createResult('CREATED', newUser.id);
  }

  async deleteUser(id: string): Promise<Result<boolean>> {
    const resultDelete = await this.usersRepository.delete(id);
    if (!resultDelete) return createResult('NOT_FOUND', resultDelete);

    return createResult('NO_CONTENT', resultDelete);
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return await this.usersRepository.getUserById(id);
  }
}
