import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { jwtService } from '../../features/auth/adapter/jwtService';
import { authQueryRepository } from '../../features/auth/database/authQueryRepoImpl';
import { RefreshTokenRequest } from '../types/api.types';

export const refreshTokenGuard = async (
  req: RefreshTokenRequest,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
    return;
  }

  const device = jwtService.getDeviceIdByToken(refreshToken);
  if (!device) {
    res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
    return;
  }

  const user = await authQueryRepository.findByDeviceId(device.deviceId);
  if (!user) {
    res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
    return;
  }

  const storedDevice = user.devices?.find(d => d.deviceId === device.deviceId);
  if (storedDevice?.date.toISOString() !== device.date) {
    res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
    return;
  }

  req.user = user;
  req.device = device;
  next();
};
