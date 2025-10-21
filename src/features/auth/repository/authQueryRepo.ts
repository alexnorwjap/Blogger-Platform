import { AuthDto, AuthViewModel, InputRegistrationDto } from './dto/authDto';
import { authModel } from '../model/authModel';

export interface AuthQueryRepository {
  getProfile(deviceId: string): Promise<AuthViewModel | null>;
  findByLoginOrEmail(dto: InputRegistrationDto | AuthDto): Promise<authModel | null>;
  findByConfirmationCode(code: string): Promise<authModel | null>;
  findByEmail(email: string): Promise<authModel | null>;
}
