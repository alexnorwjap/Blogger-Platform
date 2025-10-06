import { userCollection } from '../../../db/mongo.db';
import { AuthRepository } from '../repository/authRepo';
import { AuthMapper } from './authMapper';
import { authModel } from '../model/meModel';

export class AuthRepoImpl implements AuthRepository {
  async findByLoginOrEmail(loginOrEmail: string): Promise<authModel | null> {
    const user = await userCollection.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });
    if (!user) {
      return null;
    }
    return AuthMapper.toService(user);
  }
}
