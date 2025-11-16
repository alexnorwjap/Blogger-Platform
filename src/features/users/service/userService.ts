import { UsersRepoImpl } from '../infrastructure/db/repositories/UsersRepoImpl';
import { CreateUserDto } from './userServiceDto';
import { Result } from '../../../shared/utils/result-object';
import { createResult } from '../../../shared/utils/result-object';
import { inject, injectable } from 'inversify';
import { BcryptService } from '../../auth/adapter/bcryptService';

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepoImpl) readonly usersRepository: UsersRepoImpl,
    @inject(BcryptService) readonly bcryptService: BcryptService
  ) {}

  async createUser(dto: CreateUserDto): Promise<Result<string | null>> {
    const hashedPassword = await this.bcryptService.hashPassword(dto.password);

    const resultCreate = await this.usersRepository.create({
      ...dto,
      password: hashedPassword,
      createdAt: new Date(),
    });
    if (!resultCreate) return createResult('BAD_REQUEST', null);

    return createResult('CREATED', resultCreate);
  }

  async deleteUser(id: string): Promise<Result<boolean>> {
    const resultDelete = await this.usersRepository.delete(id);
    if (!resultDelete) return createResult('NOT_FOUND', resultDelete);

    return createResult('NO_CONTENT', resultDelete);
  }
}
