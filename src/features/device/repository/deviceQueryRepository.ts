import { ObjectId } from 'mongodb';
import { deviceCollection } from '../../../db/mongo.db';
import { DeviceModel, DeviceViewModel } from '../model/deviceModel';
import { deviceMapper } from './deviceMapper';

export class DeviceQueryRepository {
  async getDeviceById(deviceId: string): Promise<DeviceModel | null> {
    const device = await deviceCollection.findOne({ _id: new ObjectId(deviceId) });
    return device ? deviceMapper.toModel(device) : null;
  }
  async getDevicesByUserId(userId: string): Promise<DeviceViewModel[]> {
    const devices = await deviceCollection.find({ userId }).toArray();
    return devices.map(deviceMapper.toViewModel);
  }
}

export const deviceQueryRepository = new DeviceQueryRepository();
