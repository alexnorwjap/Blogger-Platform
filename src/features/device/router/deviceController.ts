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
  deletedAllOtherDevices: async (req: RefreshTokenRequest, res: Response) => {
    const device = await deviceQueryRepository.getDeviceById(req.deviceId!);
    if (!device) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
      return;
    }
    const result = await deviceService.deleteAllOtherDevicesByUserId(device.userId, req.deviceId!);
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
    const [deviceFromToken, deviceFromParams] = await Promise.all([
      deviceQueryRepository.getDeviceById(req.deviceId!),
      deviceQueryRepository.getDeviceById(req.params.deviceId),
    ]);

    if (!deviceFromToken) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
      return;
    }

    if (!deviceFromParams) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
      return;
    }

    if (deviceFromToken.userId !== deviceFromParams.userId) {
      res.sendStatus(HTTP_STATUS_CODES.FORBIDDEN);
      return;
    }
    const result = await deviceService.deleteDevice(req.params.deviceId);
    if (!result.data) {
      res.sendStatus(HTTP_STATUS_CODES[result.status]);
      return;
    }
    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  },
};
