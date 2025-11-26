import { AuthDocument } from '../database/authEntity';
import { authModel } from '../model/authModel';
import {
  AuthDto,
  InputConfirmationDto,
  InputRegistrationDto,
  recoveryCodeDto,
} from '../repository/dto/authDto';

export interface AuthRepository {
  findByLoginOrEmail: (dto: AuthDto | InputRegistrationDto) => Promise<authModel | null>;
  findByConfirmationCode: (code: string) => Promise<AuthDocument | null>;
  findByEmail: (email: string) => Promise<AuthDocument | null>;
  findByRecoveryCode: (recoveryCode: string) => Promise<AuthDocument | null>;
  save: (user: AuthDocument) => Promise<AuthDocument>;
  // create: (dto: inputCreateDto) => Promise<authModel>;
  // update: (userId: string, dto: InputConfirmationDto) => Promise<boolean>;
  // delete: (userId: string) => Promise<boolean>;
  // addRecoveryCode: (userId: string, dto: recoveryCodeDto) => Promise<boolean>;
}
