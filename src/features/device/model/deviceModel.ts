type DeviceModel = {
  ip: string;
  title: string;
  lastActiveDate: Date;
  userId: string;
};

type DeviceViewModel = {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;
};

export type { DeviceModel, DeviceViewModel };
