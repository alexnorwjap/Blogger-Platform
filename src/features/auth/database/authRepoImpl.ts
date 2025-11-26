// import { userCollection } from '../../../db/mongo.db';
import { AuthRepository } from '../repository/authRepo';
import { AuthMapper } from './authMapper';
import { authModel } from '../model/authModel';
import { inputCreateDto } from './authEntity';
import {
  InputConfirmationDto,
  AuthDto,
  InputRegistrationDto,
  recoveryCodeDto,
  passwordRecoveryDto,
} from '../repository/dto/authDto';
import { injectable } from 'inversify';
import { userModel } from '../../../db/mongo.db';
import { AuthModelEntity } from './authEntity';
import { AuthDocument } from './authEntity';

@injectable()
export class AuthRepoImpl implements AuthRepository {
  async findByLoginOrEmail(dto: AuthDto | InputRegistrationDto): Promise<authModel | null> {
    if ('loginOrEmail' in dto) {
      const user = await AuthModelEntity.findOne({
        $or: [{ login: dto.loginOrEmail }, { email: dto.loginOrEmail }],
      });
      return user ? AuthMapper.toService(user.toObject()) : null;
    }
    if ('login' in dto && 'email' in dto) {
      const user = await AuthModelEntity.findOne({
        $or: [{ login: dto.login }, { email: dto.email }],
      });
      return user ? AuthMapper.toService(user.toObject()) : null;
    }
    return null;
  }
  async findByConfirmationCode(code: string): Promise<AuthDocument | null> {
    return await AuthModelEntity.findOne({ 'confirmation.confirmationCode': code });
  }
  async findByEmail(email: string): Promise<AuthDocument | null> {
    return await AuthModelEntity.findOne({ email });
  }
  async findByRecoveryCode(recoveryCode: string): Promise<AuthDocument | null> {
    return await AuthModelEntity.findOne({ recoveryCode });
  }

  async save(user: AuthDocument): Promise<AuthDocument> {
    return await user.save();
  }
  // async create(dto: inputCreateDto): Promise<authModel> {
  //   const user = await userModel.create(dto);
  //   return AuthMapper.toService(user.toObject());
  // }
  // async update(userId: string, dto: InputConfirmationDto | passwordRecoveryDto): Promise<boolean> {
  //   const result = await userModel.updateOne({ _id: userId }, { $set: { ...dto } });
  //   return result.modifiedCount > 0;
  // }
  // async delete(userId: string): Promise<boolean> {
  //   const result = await userModel.deleteOne({ _id: userId });
  //   return result.deletedCount > 0;
  // }
  // async addRecoveryCode(userId: string, dto: recoveryCodeDto): Promise<boolean> {
  //   const result = await userModel.updateOne({ _id: userId }, { $set: { ...dto } });
  //   return result.modifiedCount > 0;
  // }
}
