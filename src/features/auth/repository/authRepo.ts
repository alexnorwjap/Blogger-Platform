import { inputCreateDto } from '../database/entity';
import { authModel } from '../model/authModel';
import {
  AuthDto,
  InputConfirmationDto,
  InputRegistrationDto,
  recoveryCodeDto,
} from '../repository/dto/authDto';

export interface AuthRepository {
  findByLoginOrEmail: (dto: AuthDto | InputRegistrationDto) => Promise<authModel | null>;
  create: (dto: inputCreateDto) => Promise<authModel>;
  update: (userId: string, dto: InputConfirmationDto) => Promise<boolean>;
  delete: (userId: string) => Promise<boolean>;
  addRecoveryCode: (userId: string, dto: recoveryCodeDto) => Promise<boolean>;
}
