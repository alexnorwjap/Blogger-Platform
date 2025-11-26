import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { JwtService } from '../../features/auth/adapter/jwtService';
import { DeviceRequest } from '../types/api.types';
import container from '../../ioc';

const jwtService = container.get<JwtService>(JwtService);

export const refreshTokenGuard = async (req: DeviceRequest, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);

  const deviceData = jwtService.getDeviceDataByToken(refreshToken);
  if (!deviceData) return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);

  const isTokenExpired = await jwtService.checkTokenExpiration(
    deviceData.deviceId,
    new Date(deviceData.lastActiveDate)
  );

  if (isTokenExpired) return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);

  req.deviceId = deviceData.deviceId;
  // req.lastActiveDate  = new Date(deviceData.lastActiveDate);
  next();
};
