import { AuthDto } from '../repository/dto/authDto';
import { AuthRepository } from '../repository/authRepo';
import bcrypt from 'bcryptjs';
import { AuthRepoImpl } from '../database/authRepoImpl';

export class AuthService {
  constructor(readonly authRepository: AuthRepository) {}

  async loginCheck(dto: AuthDto): Promise<string | null> {
    const user = await this.authRepository.findByLoginOrEmail(dto.loginOrEmail);
    if (!user) {
      return null;
    }
    const isPasswordCorrect = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordCorrect) {
      return null;
    }
    return user.userId;
  }
}

export const authService = new AuthService(new AuthRepoImpl());
