import jwt from 'jsonwebtoken';
import { SETTINGS } from '../../../shared/settings/settings';
import { ObjectId } from 'mongodb';

export const jwtService = {
  generateToken: (dto: string): string => {
    return jwt.sign({ dto }, SETTINGS.JWT_SECRET, { expiresIn: '10seconds' });
  },

  generateRefreshToken: (dto: { deviceId: string; date: Date }): string => {
    return jwt.sign({ ...dto }, SETTINGS.JWT_SECRET, { expiresIn: '20seconds' });
  },

  getDeviceIdByToken: (token: string): { deviceId: string; date: string; expirationDate: string } | null => {
    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);

      return {
        deviceId: result.deviceId,
        date: result.date,
        expirationDate: new Date(result.exp * 1000).toISOString(),
      };
    } catch (error) {
      console.log(error, 'error');
      return null;
    }
  },

  getUserIdByToken: (token: string): ObjectId | null => {
    try {
      const result = jwt.verify(token, SETTINGS.JWT_SECRET);
      if (typeof result !== 'string' && typeof result.dto === 'string') {
        return new ObjectId(result.dto);
      }
      return null;
    } catch (error) {
      console.log(error, 'error');
      return null;
    }
  },
};
