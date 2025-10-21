import { AuthDto } from '../repository/dto/authDto';
import { AuthRepository } from '../repository/authRepo';
import bcrypt from 'bcryptjs';
import { AuthRepoImpl } from '../database/authRepoImpl';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { randomUUID } from 'crypto';
import { authModel } from '../model/authModel';
import { add } from 'date-fns/add';
import { jwtService } from '../infrastructure/jwtService';
export class AuthService {
  constructor(readonly authRepository: AuthRepository) {}

  async correctCredentials(dto: AuthDto, user: authModel): Promise<string | null> {
    const isPasswordCorrect = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordCorrect) {
      return null;
    }
    return user.userId;
  }

  async createDevice(userId: string): Promise<{ deviceId: string; date: Date } | null> {
    const deviceId = randomUUID();
    const device = {
      deviceId: deviceId,
      date: new Date(),
    };
    const result = await this.authRepository.createDevice(userId, device);
    return result ? device : null;
  }
  async updateDevice(
    userId: string,
    device: { deviceId: string; date: string }
  ): Promise<{ deviceId: string; date: Date } | null> {
    const newDevice = {
      deviceId: device.deviceId,
      date: new Date(),
    };
    const result = await this.authRepository.updateDevice(userId, newDevice);
    return result ? newDevice : null;
  }

  async registration(dto: InputRegistrationDto): Promise<string> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const confirmationCode = randomUUID();
    const user = await this.authRepository.create({
      login: dto.login,
      password: hashedPassword,
      email: dto.email,
      createdAt: new Date(),
      isConfirmed: false,
      confirmation: {
        confirmationCode: confirmationCode,
        expirationDate: add(new Date(), { minutes: 15 }),
      },
    });
    return confirmationCode;
  }

  async registrationConfirmation(user: authModel): Promise<boolean> {
    if (user.confirmation.expirationDate.getTime() < Date.now()) {
      return false;
    }
    const result = await this.authRepository.update(user.userId, {
      isConfirmed: true,
      confirmation: {
        confirmationCode: user.confirmation.confirmationCode,
        expirationDate: new Date(0),
      },
    });
    return result;
  }

  async deleteUser(userId: string): Promise<boolean> {
    return await this.authRepository.delete(userId);
  }

  async registrationEmailResending(user: authModel): Promise<string> {
    const confirmationCode = randomUUID();
    const result = await this.authRepository.update(user.userId, {
      isConfirmed: false,
      confirmation: { confirmationCode: confirmationCode, expirationDate: add(new Date(), { minutes: 15 }) },
    });
    return confirmationCode;
  }
  async deleteDevice(deviceId: string): Promise<boolean> {
    return await this.authRepository.deleteDevice(deviceId);
  }
}

export const authService = new AuthService(new AuthRepoImpl());
