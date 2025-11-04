import { ObjectId } from 'mongodb';
import { DeviceModel, DeviceViewModel } from '../model/deviceModel';

type DeviceEntity = {
  _id: ObjectId;
  ip: string;
  title: string;
  lastActiveDate: Date;
  userId: string;
};

class DeviceMapper {
  toViewModel(device: DeviceEntity): DeviceViewModel {
    return {
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate,
      deviceId: device._id.toString(),
    };
  }
  toModel(device: DeviceEntity): DeviceModel {
    return {
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate,
      userId: device.userId,
    };
  }
}

export const deviceMapper = new DeviceMapper();
