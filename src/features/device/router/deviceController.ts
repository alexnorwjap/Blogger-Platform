import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { DeviceRequest, RequestParams } from '../../../shared/types/api.types';
import { DeviceQueryRepository } from '../repository/deviceQueryRepository';
import { DeviceService } from '../service/deviceService';
import { inject, injectable } from 'inversify';

@injectable()
export class DeviceController {
  constructor(
    @inject(DeviceQueryRepository) readonly deviceQueryRepository: DeviceQueryRepository,
    @inject(DeviceService) readonly deviceService: DeviceService
  ) {}

  getDevices = async (req: DeviceRequest, res: Response) => {
    const device = await this.deviceQueryRepository.getDeviceById(req.deviceId!);
    if (!device) return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);

    const devices = await this.deviceQueryRepository.getDevicesByUserId(device.userId);
    res.status(HTTP_STATUS_CODES.SUCCESS).send(devices);
  };

  deletedAllOtherDevices = async (req: DeviceRequest, res: Response) => {
    // const device = await this.deviceQueryRepository.getDeviceById(req.deviceId!);
    // if (!device) return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);

    const result = await this.deviceService.deleteAllOtherDevicesByUserId(req.deviceId!);
    if (!result.data) return res.sendStatus(HTTP_STATUS_CODES[result.status]);

    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  };

  deleteDevice = async (
    req: DeviceRequest & RequestParams<{ deviceId: string }>,
    res: Response
  ) => {
    const [deviceFromToken, deviceFromParams] = await Promise.all([
      this.deviceQueryRepository.getDeviceById(req.deviceId!),
      this.deviceQueryRepository.getDeviceById(req.params.deviceId),
    ]);

    if (!deviceFromToken) return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);

    if (!deviceFromParams) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    if (deviceFromToken.userId !== deviceFromParams.userId) {
      return res.sendStatus(HTTP_STATUS_CODES.FORBIDDEN);
    }

    const result = await this.deviceService.deleteDevice(req.params.deviceId);
    if (!result.data) return res.sendStatus(HTTP_STATUS_CODES[result.status]);

    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  };
}
