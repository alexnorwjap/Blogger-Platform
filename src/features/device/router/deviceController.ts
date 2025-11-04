import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { RefreshTokenRequest, RequestParams, UserRequest } from '../../../shared/types/api.types';
import { deviceQueryRepository } from '../repository/deviceQueryRepository';
import { deviceService } from '../service/deviceService';

export const deviceController = {
  getDevices: async (req: RefreshTokenRequest, res: Response) => {
    console.log('getDevices', req.deviceId);
    const device = await deviceQueryRepository.getDeviceById(req.deviceId!);
    if (!device) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
      return;
    }

    const devices = await deviceQueryRepository.getDevicesByUserId(device.userId);
    console.log('devices', devices);
    res.status(HTTP_STATUS_CODES.SUCCESS).send(devices);
  },
  //  актуально ли ! - использовать
  deletedAllDevices: async (req: RefreshTokenRequest, res: Response) => {
    const userId = await deviceQueryRepository.getDeviceById(req.deviceId!);
    if (!userId) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
      return;
    }
    const result = await deviceService.deleteAllDevicesByUserId(userId.userId);
    if (!result.data) {
      res.sendStatus(HTTP_STATUS_CODES[result.status]);
      return;
    }
    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  },

  //   refreshTokenGuard - имеет свой тип реквеста , нормально ли это ?
  deleteDevice: async (
    req: RefreshTokenRequest & RequestParams<{ deviceId: string }>,
    res: Response
  ) => {
    // дописть
    const result = await deviceService.deleteDevice(req.params.deviceId);
    if (!result.data) {
      res.sendStatus(HTTP_STATUS_CODES[result.status]);
      return;
    }
    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  },
};
