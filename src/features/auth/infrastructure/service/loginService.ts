import { LoginDto } from '../repositories/dto/LoginDto';
import { LoginRepository } from '../repositories/loginRepository';
import bcrypt from 'bcryptjs';
import { LoginRepoImpl } from '../db/loginRepoImpl';

class LoginService {
  constructor(readonly loginRepository: LoginRepository) {}

  async loginCheck(dto: LoginDto): Promise<boolean> {
    const user = await this.loginRepository.findByLoginOrEmail(dto.loginOrEmail);
    if (!user) {
      return false;
    }
    const isPasswordCorrect = await bcrypt.compare(dto.password, user.password);
    console.log(user, dto.password);
    if (!isPasswordCorrect) {
      return false;
    }

    return true;
  }
}

export const loginService = new LoginService(new LoginRepoImpl());
