import jwt from 'jsonwebtoken';
import { SETTINGS } from '../../../shared/settings/settings';
import { ObjectId } from 'mongodb';
import { DeviceIdType } from '../authType';

export const jwtService = {
  generateToken: (dto: string): string => {
    return jwt.sign({ dto }, SETTINGS.JWT_SECRET, { expiresIn: '10seconds' });
  },

  generateRefreshToken: (dto: { deviceId: string; date: Date }): string => {
    return jwt.sign({ ...dto }, SETTINGS.JWT_SECRET, { expiresIn: '20seconds' });
  },

  getDeviceIdByToken: (token: string): DeviceIdType | null => {
    try {
      const result = jwt.verify(token, SETTINGS.JWT_SECRET) as {
        deviceId: string;
        date: string;
      };
      return result
        ? {
            deviceId: result.deviceId,
            date: result.date,
          }
        : null;
    } catch (error) {
      return null;
    }
  },

  getUserIdByToken: (token: string): string | null => {
    try {
      const result = jwt.verify(token, SETTINGS.JWT_SECRET) as { dto: string };
      return result?.dto ?? null;
    } catch (error) {
      return null;
    }
  },
};
