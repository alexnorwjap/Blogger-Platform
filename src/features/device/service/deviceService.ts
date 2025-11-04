import { DeviceRepository } from '../repository/deviceRepository';
import { InputCreateDeviceDto } from './typeService';
import { ObjectId } from 'mongodb';
import { createResult, Result } from '../../../shared/utils/result-object';

class DeviceService {
  constructor(readonly deviceRepository: DeviceRepository) {}

  async createDevice(
    dto: InputCreateDeviceDto
  ): Promise<{ deviceId: string; lastActiveDate: Date } | null> {
    const newDate = new Date();
    const device = {
      ip: dto.ip,
      title: dto.title,
      lastActiveDate: newDate,
      userId: dto.userId,
    };
    const result = await this.deviceRepository.create(device);
    return result
      ? {
          deviceId: result,
          lastActiveDate: newDate,
        }
      : null;
  }

  async updateDevice(deviceId: string, lastActiveDate: Date): Promise<boolean | null> {
    const result = await this.deviceRepository.update(deviceId, lastActiveDate);
    return result ? result : null;
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

export const deviceService = new DeviceService(new DeviceRepository());
