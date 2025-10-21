import { authModel } from '../model/authModel';
import { entityDB } from './entity';

export class AuthMapper {
  public static toService(entity: entityDB): authModel {
    return {
      userId: entity._id.toString(),
      login: entity.login,
      email: entity.email,
      password: entity.password,
      createdAt: entity.createdAt,
      isConfirmed: entity.isConfirmed,
      confirmation: entity.confirmation,
      devices: entity.devices?.map(device => ({
        deviceId: device.deviceId,
        date: device.date,
      })),
    };
  }
}
