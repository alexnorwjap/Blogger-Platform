import { AuthQueryRepository } from '../repository/authQueryRepo';
import { AuthViewModel } from '../authType';
import { AuthQueryMapper } from './authQueryMapper';

import { injectable } from 'inversify';
import { UserModel } from './userEntity';

@injectable()
export class AuthQueryRepoImpl implements AuthQueryRepository {
  async getUserById(userId: string): Promise<AuthViewModel | null> {
    const user = await UserModel.findById(userId);

    return user ? AuthQueryMapper.toViewModel(user.toObject()) : null;
  }
}
