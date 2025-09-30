import { userCollection } from '../../../../db/mongo.db';
import { LoginRepository } from '../repositories/loginRepository';
import { LoginMapper } from './loginMapper';
import { User } from '../../../users/models/User';

export class LoginRepoImpl implements LoginRepository {
  async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    const user = await userCollection.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });
    if (!user) {
      return null;
    }
    return LoginMapper.toDomain(user);
  }
}
