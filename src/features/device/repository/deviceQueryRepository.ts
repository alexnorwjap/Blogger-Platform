import { deviceMapper, DeviceViewModel } from './deviceMapper';
import { injectable } from 'inversify';
import { DeviceModel, Device } from '../database/deviceEntity';

@injectable()
export class DeviceQueryRepository {
  async getDeviceById(deviceId: string): Promise<Device | null> {
    const device = await DeviceModel.findById(deviceId);
    return device ? device.toObject() : null;
  }
  async getDevicesByUserId(userId: string): Promise<DeviceViewModel[]> {
    const devices = await DeviceModel.find({ userId });
    return devices.map(device => deviceMapper.toViewModel(device.toObject()));
  }
}
