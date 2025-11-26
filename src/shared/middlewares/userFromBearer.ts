import { NextFunction } from 'express';
import { UserRequest } from '../types/api.types';
import { JwtService } from '../../features/auth/adapter/jwtService';
import container from '../../ioc';
import { Response } from 'express';

const jwtService = container.get<JwtService>(JwtService);

const userFromBearer = async (req: UserRequest, res: Response, next: NextFunction) => {
  let userId;
  const auth =
    typeof req.headers['authorization'] === 'string' ? req.headers['authorization'] : null;

  if (!auth) return next();

  const [type, token] = auth.split(' ');
  if (type !== 'Bearer') return next();

  userId = jwtService.getUserIdByToken(token);
  if (!userId) return next();

  req.user = userId;
  return next();
};

export { userFromBearer };
