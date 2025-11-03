import { ObjectId } from 'mongodb';
import { DeviceModel } from '../model/deviceModel';

type DeviceEntity = {
  _id: ObjectId;
  ip: string;
  title: string;
  lastActiveDate: Date;
  userId: string;
};

class DeviceMapper {
  toDomain(device: DeviceEntity): DeviceModel {
    return {
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate,
      userId: device.userId,
    };
  }
}

export const deviceMapper = new DeviceMapper();
