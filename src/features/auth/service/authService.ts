import { AuthDto } from '../repository/dto/authDto';
import { AuthRepository } from '../repository/authRepo';
import bcrypt from 'bcryptjs';
import { AuthRepoImpl } from '../database/authRepoImpl';

export class AuthService {
  constructor(readonly authRepository: AuthRepository) {}

  async loginCheck(dto: AuthDto): Promise<boolean> {
    const user = await this.authRepository.findByLoginOrEmail(dto.loginOrEmail);
    if (!user) {
      return false;
    }
    const isPasswordCorrect = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordCorrect) {
      return false;
    }
    return true;
  }
}

export const authService = new AuthService(new AuthRepoImpl());
