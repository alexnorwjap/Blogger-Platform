import jwt from 'jsonwebtoken';
import { SETTINGS } from '../../../shared/settings/settings';
import { deviceQueryRepository } from '../../device/repository/deviceQueryRepository';

export const jwtService = {
  generateToken: (dto: string): string => {
    return jwt.sign({ dto }, SETTINGS.JWT_SECRET, { expiresIn: '10seconds' });
  },

  generateRefreshToken: (dto: { id: string; lastActiveDate: Date }): string => {
    return jwt.sign({ dto }, SETTINGS.JWT_SECRET, { expiresIn: '20seconds' });
  },

  getDeviceDataByToken: (token: string): { id: string; lastActiveDate: Date } | null => {
    try {
      const result = jwt.verify(token, SETTINGS.JWT_SECRET) as {
        dto: { id: string; lastActiveDate: Date };
      };
      return result ? result.dto : null;
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

  checkTokenExpiration: async (id: string, lastActiveDate: Date): Promise<boolean> => {
    const device = await deviceQueryRepository.getDeviceById(id);
    return device ? device.lastActiveDate.getTime() !== lastActiveDate.getTime() : true;
  },
};
