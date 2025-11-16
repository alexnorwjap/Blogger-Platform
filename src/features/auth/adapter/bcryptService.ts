import bcrypt from 'bcryptjs';
import { injectable } from 'inversify';

@injectable()
export class BcryptService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 11);
  }

  async checkPassword(inputPassword: string, userPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, userPassword);
  }
}
