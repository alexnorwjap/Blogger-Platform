import { ObjectId } from 'mongodb';
import { deviceCollection } from '../../../db/mongo.db';
import { DeviceModel } from '../model/deviceModel';
import { deviceMapper } from './deviceMapper';

export class DeviceQueryRepository {
  async getDeviceById(deviceId: string): Promise<DeviceModel | null> {
    const device = await deviceCollection.findOne({ _id: new ObjectId(deviceId) });
    return device ? deviceMapper.toDomain(device) : null;
  }
  async getDevicesByUserId(userId: string): Promise<DeviceModel[] | null> {
    const devices = await deviceCollection.find({ userId }).toArray();
    return devices.length > 0 ? devices.map(deviceMapper.toDomain) : null;
  }
}

export const deviceQueryRepository = new DeviceQueryRepository();
