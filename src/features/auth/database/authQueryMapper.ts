import { entityDB } from './entity';
import { AuthViewModel } from '../authType';

export class AuthQueryMapper {
  public static toViewModel(entity: entityDB): AuthViewModel {
    return {
      login: entity.login,
      email: entity.email,
      userId: entity._id.toString(),
    };
  }
}
