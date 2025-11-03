import { ObjectId } from 'mongodb';
import { DeviceModel } from '../model/deviceModel';
import { deviceCollection } from '../../../db/mongo.db';

export class DeviceRepository {
  async create(dto: DeviceModel): Promise<string> {
    const result = await deviceCollection.insertOne({ _id: new ObjectId(), ...dto });
    return result.insertedId.toString();
  }

  async update(deviceId: string, lastActiveDate: Date): Promise<boolean> {
    const result = await deviceCollection.updateOne(
      {
        _id: new ObjectId(deviceId),
      },
      { $set: { lastActiveDate: lastActiveDate } }
    );
    return result.modifiedCount > 0;
  }

  async delete(deviceId: string): Promise<boolean> {
    const result = await deviceCollection.deleteOne({ _id: new ObjectId(deviceId) });
    return result.deletedCount > 0;
  }

  async deleteAll(userId: string): Promise<boolean> {
    const result = await deviceCollection.deleteMany({ userId });
    return result.deletedCount > 0;
  }
}
