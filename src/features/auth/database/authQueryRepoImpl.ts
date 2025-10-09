import { userCollection } from '../../../db/mongo.db';
import { AuthQueryRepository } from '../repository/authQueryRepo';
import { AuthViewModel } from '../repository/dto/authDto';
import { ObjectId } from 'mongodb';
import { AuthQueryMapper } from './authQueryMapper';

class AuthQueryRepoImpl implements AuthQueryRepository {
  async getProfile(userId: ObjectId): Promise<AuthViewModel | null> {
    const user = await userCollection.findOne({ _id: userId });
    return user ? AuthQueryMapper.toService(user) : null;
  }
}

export const authQueryRepository = new AuthQueryRepoImpl();
