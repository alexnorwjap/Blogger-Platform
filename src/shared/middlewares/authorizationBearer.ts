import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { UserRequest } from '../types/api.types';
import { jwtService } from '../../features/auth/adapter/jwtService';

const authorizationBearer = async (req: UserRequest, res: Response, next: NextFunction) => {
  const auth =
    typeof req.headers['authorization'] === 'string' ? req.headers['authorization'] : null;

  if (!auth) {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send('Unauthorized');
    return;
  }

  const [type, token] = auth.split(' ');
  if (type !== 'Bearer') {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send('Unauthorized');
    return;
  }

  const userId = jwtService.getUserIdByToken(token);
  if (userId) {
    req.user = userId;
    next();
  } else {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send('Unauthorized');
    return;
  }
};

export { authorizationBearer };
