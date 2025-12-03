import { ObjectId } from 'mongodb';
import mongoose, { HydratedDocument, Model, model } from 'mongoose';
import { InputCreateDeviceDto } from '../service/typeService';

type Device = {
  _id: ObjectId;
  ip: string;
  title: string;
  lastActiveDate: Date;
  userId: string;
};

interface DeviceMethods {
  updateDate(): void;
}
interface DeviceStaticsMethods {
  createDevice(dto: InputCreateDeviceDto): DeviceDocument;
}

type DeviceDocument = HydratedDocument<Device, DeviceMethods>;
type DeviceModel = Model<Device, {}, DeviceMethods> & DeviceStaticsMethods;

const deviceSchema = new mongoose.Schema<Device, DeviceModel, DeviceMethods>({
  ip: { type: String, required: true },
  title: { type: String, required: true },
  lastActiveDate: { type: Date, required: true, expires: 60, default: () => new Date() },
  userId: { type: String, required: true },
});

class DeviceEntity {
  declare lastActiveDate: Date;

  static createDevice(dto: InputCreateDeviceDto): DeviceDocument {
    return new DeviceModel({
      ip: dto.ip,
      title: dto.title,
      userId: dto.userId,
    });
  }

  updateDate(): void {
    this.lastActiveDate = new Date();
  }
}

deviceSchema.loadClass(DeviceEntity);

const DeviceModel = model<Device, DeviceModel>('Device', deviceSchema);

export { Device, DeviceModel, DeviceDocument };
