import jwt from 'jsonwebtoken';
import { SETTINGS } from '../../../shared/settings/settings';
import { DeviceQueryRepository } from '../../device/repository/deviceQueryRepository';
import { inject, injectable } from 'inversify';

export type RefreshTokenPayload = {
  deviceId: string;
  lastActiveDate: Date;
};

@injectable()
export class JwtService {
  constructor(
    @inject(DeviceQueryRepository) readonly deviceQueryRepository: DeviceQueryRepository
  ) {}
  generateToken(dto: string): string {
    return jwt.sign({ dto }, SETTINGS.JWT_SECRET, { expiresIn: '5m' });
  }

  generateRefreshToken(dto: RefreshTokenPayload): string {
    return jwt.sign({ ...dto }, SETTINGS.JWT_SECRET, { expiresIn: '10m' });
  }

  getDeviceDataByToken(token: string): RefreshTokenPayload | null {
    try {
      const result = jwt.verify(token, SETTINGS.JWT_SECRET) as RefreshTokenPayload;
      return result ? result : null;
    } catch (error) {
      return null;
    }
  }

  getUserIdByToken(token: string): string | null {
    try {
      const result = jwt.verify(token, SETTINGS.JWT_SECRET) as { dto: string };
      return result?.dto ?? null;
    } catch (error) {
      return null;
    }
  }

  async checkTokenExpiration(deviceId: string, lastActiveDate: Date): Promise<boolean> {
    const device = await this.deviceQueryRepository.getDeviceById(deviceId);
    return device ? device.lastActiveDate.getTime() !== lastActiveDate.getTime() : true;
  }
}
