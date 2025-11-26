import { authModel } from '../model/authModel';
import { entityDB } from './authEntity';

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
      recoveryCode: entity.recoveryCode || '',
      recoveryCodeExpirationDate: entity.recoveryCodeExpirationDate || new Date(0),
    };
  }
}
