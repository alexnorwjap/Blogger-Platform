import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { JwtService } from '../../features/auth/adapter/jwtService';
import { RefreshTokenRequest } from '../types/api.types';
import container from '../../ioc';

const jwtService = container.get<JwtService>(JwtService);

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
