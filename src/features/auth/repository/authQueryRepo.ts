import { AuthDto, InputRegistrationDto } from './dto/authDto';
import { AuthViewModel } from '../authType';
import { authModel } from '../model/authModel';

export interface AuthQueryRepository {
  getProfile(userId: string): Promise<AuthViewModel | null>;
  findByLoginOrEmail(dto: InputRegistrationDto | AuthDto): Promise<authModel | null>;
  findByConfirmationCode(code: string): Promise<authModel | null>;
  findByEmail(email: string): Promise<authModel | null>;
  findByDeviceId(deviceId: string): Promise<authModel | null>;
  findByRecoveryCode(recoveryCode: string): Promise<authModel | null>;
}
