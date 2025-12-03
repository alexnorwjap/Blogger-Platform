import { AuthRepository } from '../repository/authRepo';
import { AuthDto, InputRegistrationDto } from '../repository/dto/authDto';
import { injectable } from 'inversify';
import { UserModel } from './userEntity';
import { UserDocument } from './userEntity';

@injectable()
export class AuthRepoImpl implements AuthRepository {
  async findByLoginOrEmail(dto: AuthDto | InputRegistrationDto): Promise<UserDocument | null> {
    const searchFields =
      'loginOrEmail' in dto
        ? { $or: [{ login: dto.loginOrEmail }, { email: dto.loginOrEmail }] }
        : { $or: [{ login: dto.login }, { email: dto.email }] };
    return await UserModel.findOne(searchFields);
  }
  async findByConfirmationCode(code: string): Promise<UserDocument | null> {
    return await UserModel.findOne({ 'confirmation.confirmationCode': code });
  }
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await UserModel.findOne({ email });
  }
  async findByRecoveryCode(recoveryCode: string): Promise<UserDocument | null> {
    return await UserModel.findOne({ recoveryCode });
  }

  async save(user: UserDocument): Promise<UserDocument> {
    return await user.save();
  }
}
