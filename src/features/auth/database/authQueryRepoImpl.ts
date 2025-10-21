import { userCollection } from '../../../db/mongo.db';
import { AuthQueryRepository } from '../repository/authQueryRepo';
import { AuthViewModel, InputRegistrationDto } from '../repository/dto/authDto';
import { ObjectId } from 'mongodb';
import { AuthQueryMapper } from './authQueryMapper';
import { authModel } from '../model/authModel';
import { AuthMapper } from './authMapper';
import { AuthDto } from '../repository/dto/authDto';

class AuthQueryRepoImpl implements AuthQueryRepository {
  async getProfile(userId: ObjectId): Promise<AuthViewModel | null> {
    const user = await userCollection.findOne({ _id: userId });
    return user ? AuthQueryMapper.toViewModel(user) : null;
  }

  async findByLoginOrEmail(dto: InputRegistrationDto | AuthDto): Promise<authModel | null> {
    if ('login' in dto && 'email' in dto) {
      const user = await userCollection.findOne({ $or: [{ login: dto.login }, { email: dto.email }] });
      if (!user) {
        return null;
      }
      return AuthMapper.toService(user);
    }
    if ('loginOrEmail' in dto) {
      const user = await userCollection.findOne({
        $or: [{ login: dto.loginOrEmail }, { email: dto.loginOrEmail }],
      });
      if (!user) {
        return null;
      }
      return AuthMapper.toService(user);
    }
    return null;
  }

  async findByConfirmationCode(code: string): Promise<authModel | null> {
    const user = await userCollection.findOne({ 'confirmation.confirmationCode': code });
    if (!user || user.isConfirmed) {
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
    return user ? AuthMapper.toService(user) : null;
  }
}

export const authQueryRepository = new AuthQueryRepoImpl();
