import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { DeviceRequest, UserRequest } from '../types/api.types';
import { jwtService } from '../../features/auth/infrastructure/jwtService';

const authorizationBearer = async (req: UserRequest, res: Response, next: NextFunction) => {
  console.log(req.headers['authorization']);
  const auth = typeof req.headers['authorization'] === 'string' ? req.headers['authorization'] : null;

  if (!auth) {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED401).send('Unauthorized');
    return;
  }

  const [type, token] = auth.split(' ');
  if (type !== 'Bearer') {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED401).send('Unauthorized');
    return;
  }

  const userId = jwtService.getUserIdByToken(token);
  console.log(userId);
  if (userId) {
    req.user = userId;
    next();
  } else {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED401).send('Unauthorized');
    return;
  }
};

const authorizationDeviceBearer = async (req: DeviceRequest, res: Response, next: NextFunction) => {
  const auth = typeof req.headers['authorization'] === 'string' ? req.headers['authorization'] : null;
  if (!auth) {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED401).send('Unauthorized');
    return;
  }
  const [type, token] = auth.split(' ');
  if (type !== 'Bearer') {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED401).send('Unauthorized');
    return;
  }
  const device = jwtService.getDeviceIdByToken(token);
  if (!device) {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED401).send('Unauthorized');
    return;
  }
  req.deviceId = device.deviceId;
  next();
};

export { authorizationBearer, authorizationDeviceBearer };
