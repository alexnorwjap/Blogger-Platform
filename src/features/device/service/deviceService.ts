import { DeviceRepository } from '../repository/deviceRepository';
import { InputCreateDeviceDto } from './typeService';
import { createResult, Result } from '../../../shared/utils/result-object';
import { injectable, inject } from 'inversify';
import { DeviceDocument } from '../database/deviceEntity';
import { DeviceModelEntity } from '../database/deviceEntity';

@injectable()
export class DeviceService {
  constructor(@inject(DeviceRepository) readonly deviceRepository: DeviceRepository) {}

  async createDevice(
    dto: InputCreateDeviceDto
  ): Promise<{ deviceId: string; lastActiveDate: Date }> {
    const device = new DeviceModelEntity({
      ip: dto.ip,
      title: dto.title,
      userId: dto.userId,
    });
    await this.deviceRepository.save(device);

    return { deviceId: device.id, lastActiveDate: device.lastActiveDate };
  }

  async updateDevice(deviceId: string): Promise<DeviceDocument | null> {
    const device = await this.deviceRepository.findById(deviceId);
    if (!device) return null;

    device.lastActiveDate = new Date();
    const newDevice = await this.deviceRepository.save(device);
    return newDevice;
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
}
