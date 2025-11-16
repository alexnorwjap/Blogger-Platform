import { DeviceRepository } from '../repository/deviceRepository';
import { InputCreateDeviceDto } from './typeService';
import { createResult, Result } from '../../../shared/utils/result-object';
import { injectable, inject } from 'inversify';

@injectable()
export class DeviceService {
  constructor(@inject(DeviceRepository) readonly deviceRepository: DeviceRepository) {}

  async createDevice(
    dto: InputCreateDeviceDto
  ): Promise<{ deviceId: string; lastActiveDate: Date }> {
    const newDate = new Date();
    const device = {
      ip: dto.ip,
      title: dto.title,
      lastActiveDate: newDate,
      userId: dto.userId,
    };
    const result = await this.deviceRepository.create(device);
    return { deviceId: result, lastActiveDate: newDate };
  }

  async updateDevice(deviceId: string, lastActiveDate: Date): Promise<boolean> {
    const result = await this.deviceRepository.update(deviceId, lastActiveDate);
    return result;
  }

  async deleteDevice(deviceId: string): Promise<Result<boolean>> {
    const result = await this.deviceRepository.delete(deviceId);
    return result ? createResult('NO_CONTENT', result) : createResult('NOT_FOUND', result);
  }

  async deleteAllOtherDevicesByUserId(userId: string, deviceId: string): Promise<Result<boolean>> {
    const result = await this.deviceRepository.deleteAllOther(userId, deviceId);
    return result ? createResult('NO_CONTENT', result) : createResult('NOT_FOUND', result);
  }
}
