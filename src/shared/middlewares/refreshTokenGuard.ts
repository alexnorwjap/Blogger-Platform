import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { jwtService } from '../../features/auth/adapter/jwtService';
import { authQueryRepository } from '../../features/auth/database/authQueryRepoImpl';
import { RefreshTokenRequest } from '../types/api.types';
import { deviceQueryRepository } from '../../features/device/repository/deviceQueryRepository';

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
  console.log(refreshToken, 'refreshToken');

  const deviceData = jwtService.getDeviceDataByToken(refreshToken);
  if (!deviceData) {
    res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
    return;
  }
  console.log(deviceData, 'deviceData');
  const isTokenExpired = await jwtService.checkTokenExpiration(
    deviceData.deviceId,
    new Date(deviceData.lastActiveDate)
  );

  if (isTokenExpired) {
    res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
    return;
  }
  console.log(isTokenExpired, 'isToke,nExpired');

  req.deviceId = deviceData.deviceId;
  req.lastActiveDate = new Date(deviceData.lastActiveDate);
  next();
};
