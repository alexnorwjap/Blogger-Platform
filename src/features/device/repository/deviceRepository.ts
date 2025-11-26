import { DeviceModel } from '../model/deviceModel';

import { injectable } from 'inversify';
// import { deviceModel } from '../../../db/mongo.db';
import { DeviceDocument, DeviceModelEntity } from '../database/deviceEntity';

@injectable()
export class DeviceRepository {
  async findById(deviceId: string): Promise<DeviceDocument | null> {
    return await DeviceModelEntity.findById(deviceId);
  }

  // async create(dto: DeviceModel): Promise<string> {
  //   const result = await deviceModel.create(dto);
  //   return result._id.toString();
  // }

  async save(device: DeviceDocument): Promise<DeviceDocument> {
    return await device.save();
  }

  // async update(deviceId: string, lastActiveDate: Date): Promise<boolean> {
  //   const result = await deviceModel.updateOne(
  //     {
  //       _id: deviceId,
  //     },
  //     { $set: { lastActiveDate: lastActiveDate } }
  //   );
  //   return result.modifiedCount > 0;
  // }

  async delete(deviceId: string): Promise<boolean> {
    const result = await DeviceModelEntity.deleteOne({ _id: deviceId });
    return result.deletedCount > 0;
  }

  async deleteAllOther(userId: string, deviceId: string): Promise<boolean> {
    const result = await DeviceModelEntity.deleteMany({
      userId,
      _id: { $ne: deviceId },
    });
    return result.deletedCount > 0;
  }
}
