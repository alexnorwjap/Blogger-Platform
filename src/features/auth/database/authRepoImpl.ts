import { userCollection } from '../../../db/mongo.db';
import { AuthRepository } from '../repository/authRepo';
import { AuthMapper } from './authMapper';
import { authModel } from '../model/authModel';
import { inputCreateDto } from './entity';
import { ObjectId } from 'mongodb';
import { InputConfirmationDto } from '../repository/dto/authDto';

export class AuthRepoImpl implements AuthRepository {
  async create(dto: inputCreateDto): Promise<authModel> {
    const user = await userCollection.insertOne({ _id: new ObjectId(), ...dto });
    return AuthMapper.toService({ _id: user.insertedId, ...dto });
  }
  async update(userId: string, dto: { isConfirmed: boolean }): Promise<boolean> {
    const result = await userCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { ...dto } });
    if (result.modifiedCount > 0) {
      return true;
    }
    return false;
  }
  async delete(userId: string): Promise<boolean> {
    const result = await userCollection.deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount > 0;
  }

  async createDevice(userId: string, device: { deviceId: string; date: Date }): Promise<boolean> {
    const result = await userCollection.updateOne({ _id: new ObjectId(userId) }, { $push: { devices: device } });
    return result.modifiedCount > 0;
  }

  async updateDevice(userId: string, device: { deviceId: string; date: Date }): Promise<boolean> {
    const result = await userCollection.updateOne(
      {
        _id: new ObjectId(userId),
        'devices.deviceId': device.deviceId,
      },
      { $set: { 'devices.$.date': device.date } }
    );
    return result.modifiedCount > 0;
  }
  async deleteDevice(deviceId: string): Promise<boolean> {
    const result = await userCollection.updateOne(
      { 'devices.deviceId': deviceId },
      { $pull: { devices: { deviceId } } }
    );
    return result.modifiedCount > 0;
  }
}
