import { userCollection } from '../../../db/mongo.db';
import { AuthQueryRepository } from '../repository/authQueryRepo';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { AuthViewModel } from '../authType';
import { ObjectId } from 'mongodb';
import { AuthQueryMapper } from './authQueryMapper';
import { authModel } from '../model/authModel';
import { AuthMapper } from './authMapper';
import { AuthDto } from '../repository/dto/authDto';

class AuthQueryRepoImpl implements AuthQueryRepository {
  async getProfile(userId: string): Promise<AuthViewModel | null> {
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return null;
    }
    return user ? AuthQueryMapper.toViewModel(user) : null;
  }

  async findByLoginOrEmail(dto: InputRegistrationDto): Promise<authModel | null> {
    const user = await userCollection.findOne({
      $or: [{ login: dto.login }, { email: dto.email }],
    });
    return user ? AuthMapper.toService(user) : null;
  }

  async findByConfirmationCode(code: string): Promise<authModel | null> {
    const user = await userCollection.findOne({ 'confirmation.confirmationCode': code });
    if (!user) {
      return null;
    }
    return AuthMapper.toService(user);
  }

  async findByEmail(email: string): Promise<authModel | null> {
    const user = await userCollection.findOne({ email });
    return user ? AuthMapper.toService(user) : null;
  }

  async findByDeviceId(deviceId: string): Promise<authModel | null> {
    const user = await userCollection.findOne({ 'devices.deviceId': deviceId });
    if (!user) {
      return null;
    }
    return AuthMapper.toService(user);
  }
}

export const authQueryRepository = new AuthQueryRepoImpl();
