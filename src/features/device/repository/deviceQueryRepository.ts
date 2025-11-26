import { DeviceModel, DeviceViewModel } from '../model/deviceModel';
import { deviceMapper } from './deviceMapper';
import { injectable } from 'inversify';
import { DeviceModelEntity } from '../database/deviceEntity';

@injectable()
export class DeviceQueryRepository {
  async getDeviceById(deviceId: string): Promise<DeviceModel | null> {
    const device = await DeviceModelEntity.findById(deviceId);
    return device ? deviceMapper.toModel(device.toObject()) : null;
  }
  async getDevicesByUserId(userId: string): Promise<DeviceViewModel[]> {
    const devices = await DeviceModelEntity.find({ userId });
    return devices.map(device => deviceMapper.toViewModel(device.toObject()));
  }
}
