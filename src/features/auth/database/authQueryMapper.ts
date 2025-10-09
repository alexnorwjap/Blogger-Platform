import { entityDB } from './entity';
import { AuthViewModel } from '../repository/dto/authDto';

export class AuthQueryMapper {
  public static toService(entity: entityDB): AuthViewModel {
    return {
      login: entity.login,
      email: entity.email,
      userId: entity._id.toString(),
    };
  }
}
