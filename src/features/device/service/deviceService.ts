import { DeviceRepository } from '../repository/deviceRepository';
import { InputCreateDeviceDto } from './typeService';
import { createResult, Result } from '../../../shared/utils/result-object';
import { injectable, inject } from 'inversify';
import { DeviceDocument, DeviceModel } from '../database/deviceEntity';
import { RefreshTokenPayload } from '../../auth/adapter/jwtService';
import { UserDocument } from '../../auth/database/userEntity';

@injectable()
export class DeviceService {
  constructor(@inject(DeviceRepository) readonly deviceRepository: DeviceRepository) {}

  async createDevice(dto: InputCreateDeviceDto): Promise<RefreshTokenPayload> {
    const device = DeviceModel.createDevice(dto);
    await this.deviceRepository.save(device);

    return { deviceId: device.id, lastActiveDate: device.lastActiveDate };
  }

  async updateDevice(deviceId: string): Promise<DeviceDocument | null> {
    const device = await this.deviceRepository.findById(deviceId);
    if (!device) return null;

    device.updateDate();
    return await this.deviceRepository.save(device);
  }

  async deleteDevice(deviceId: string): Promise<Result<boolean>> {
    const result = await this.deviceRepository.delete(deviceId);
    return result ? createResult('NO_CONTENT', result) : createResult('NOT_FOUND', result);
  }

  async deleteAllOtherDevicesByUserId(deviceId: string): Promise<Result<boolean>> {
    const device = await this.deviceRepository.findById(deviceId);
    if (!device) return createResult('UNAUTHORIZED', false);

    const result = await this.deviceRepository.deleteAllOther(device.userId, device.id);
    return result ? createResult('NO_CONTENT', result) : createResult('NOT_FOUND', result);
  }

  async getByDeviceId(deviceId: string): Promise<string | null> {
    const device = await this.deviceRepository.findById(deviceId);
    if (!device) return null;

    return device.userId;
  }
}
