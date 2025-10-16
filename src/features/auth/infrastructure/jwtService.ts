import jwt from 'jsonwebtoken';
import { SETTINGS } from '../../../shared/settings/settings';
import { ObjectId } from 'mongodb';

export const jwtService = {
  generateToken: (dto: string): string => {
    return jwt.sign({ dto }, SETTINGS.JWT_SECRET, { expiresIn: '1h' });
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
