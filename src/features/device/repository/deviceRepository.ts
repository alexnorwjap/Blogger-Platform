import { injectable } from 'inversify';
import { DeviceDocument, DeviceModel } from '../database/deviceEntity';

@injectable()
export class DeviceRepository {
  async findById(deviceId: string): Promise<DeviceDocument | null> {
    return await DeviceModel.findById(deviceId);
  }

  async save(device: DeviceDocument): Promise<DeviceDocument> {
    return await device.save();
  }

  async delete(deviceId: string): Promise<boolean> {
    const result = await DeviceModel.deleteOne({ _id: deviceId });
    return result.deletedCount > 0;
  }

  async deleteAllOther(userId: string, deviceId: string): Promise<boolean> {
    const result = await DeviceModel.deleteMany({
      userId,
      _id: { $ne: deviceId },
    });
    return result.deletedCount > 0;
  }
}
