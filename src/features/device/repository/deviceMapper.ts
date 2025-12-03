import { Device } from '../database/deviceEntity';

type DeviceViewModel = {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;
};
class DeviceMapper {
  toViewModel(device: Device): DeviceViewModel {
    return {
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate,
      deviceId: device._id.toString(),
    };
  }
}

const deviceMapper = new DeviceMapper();

export { DeviceViewModel, deviceMapper };
