import { AuthQueryRepository } from '../repository/authQueryRepo';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { AuthViewModel } from '../authType';
import { AuthQueryMapper } from './authQueryMapper';
import { authModel } from '../model/authModel';
import { AuthMapper } from './authMapper';
import { injectable } from 'inversify';
import { userModel } from '../../../db/mongo.db';
import { AuthModelEntity } from './authEntity';
import { AuthDocument } from './authEntity';

@injectable()
export class AuthQueryRepoImpl implements AuthQueryRepository {
  async getProfile(userId: string): Promise<AuthViewModel | null> {
    const user = await AuthModelEntity.findById(userId);

    return user ? AuthQueryMapper.toViewModel(user.toObject()) : null;
  }

  // async findByLoginOrEmail(dto: InputRegistrationDto): Promise<AuthDocument | null> {
  //   const user = await AuthModelEntity.findOne({
  //     $or: [{ login: dto.login }, { email: dto.email }],
  //   });
  //   return user ? user : null;
  // }

  // async findByConfirmationCode(code: string): Promise<authModel | null> {
  //   const user = await userModel.findOne({ 'confirmation.confirmationCode': code }).lean();
  //   return user ? AuthMapper.toService(user) : null;
  // }

  // async findByEmail(email: string): Promise<authModel | null> {
  //   const user = await userModel.findOne({ email }).lean();
  //   return user ? AuthMapper.toService(user) : null;
  // }

  async findByDeviceId(deviceId: string): Promise<authModel | null> {
    const user = await userModel.findOne({ 'devices.deviceId': deviceId }).lean();
    return user ? AuthMapper.toService(user) : null;
  }

  // async findByRecoveryCode(recoveryCode: string): Promise<authModel | null> {
  //   const user = await userModel.findOne({ recoveryCode }).lean();
  //   return user ? AuthMapper.toService(user) : null;
  // }
}
