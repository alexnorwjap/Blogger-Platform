import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { UserRequest } from '../types/api.types';
import { JwtService } from '../../features/auth/adapter/jwtService';
import container from '../../ioc';

const jwtService = container.get<JwtService>(JwtService);

const authorizationBearer = async (req: UserRequest, res: Response, next: NextFunction) => {
  const auth =
    typeof req.headers['authorization'] === 'string' ? req.headers['authorization'] : null;

  if (!auth) return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send('Unauthorized');

  const [type, token] = auth.split(' ');
  if (type !== 'Bearer') return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send('Unauthorized');

  const userId = jwtService.getUserIdByToken(token);
  if (!userId) return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send('Unauthorized');

  req.user = userId;
  next();
};

export { authorizationBearer };
