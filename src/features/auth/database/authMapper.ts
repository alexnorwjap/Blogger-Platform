import { authModel } from '../model/meModel';
import { entityDB } from './entity';

export class AuthMapper {
  public static toService(entity: entityDB): authModel {
    return {
      userId: entity._id.toString(),
      login: entity.login,
      email: entity.email,
      password: entity.password,
    };
  }
}
