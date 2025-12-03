import { UserDocument } from '../database/userEntity';
import { AuthDto, InputRegistrationDto } from '../repository/dto/authDto';

export interface AuthRepository {
  findByLoginOrEmail: (dto: AuthDto | InputRegistrationDto) => Promise<UserDocument | null>;
  findByConfirmationCode: (code: string) => Promise<UserDocument | null>;
  findByEmail: (email: string) => Promise<UserDocument | null>;
  findByRecoveryCode: (recoveryCode: string) => Promise<UserDocument | null>;
  save: (user: UserDocument) => Promise<UserDocument>;
}
