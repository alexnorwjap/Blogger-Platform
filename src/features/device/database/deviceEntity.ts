import { ObjectId } from 'mongodb';
import mongoose, { HydratedDocument, model } from 'mongoose';

type DeviceEntity = {
  _id: ObjectId;
  ip: string;
  title: string;
  lastActiveDate: Date;
  userId: string;
};

type DeviceDocument = HydratedDocument<DeviceEntity>;

const deviceSchema = new mongoose.Schema<DeviceEntity>({
  ip: { type: String, required: true },
  title: { type: String, required: true },
  lastActiveDate: { type: Date, required: true, expires: 60, default: () => new Date() },
  userId: { type: String, required: true },
});

const DeviceModelEntity = model<DeviceEntity>('Device', deviceSchema);

export { DeviceEntity, deviceSchema, DeviceModelEntity, DeviceDocument };
