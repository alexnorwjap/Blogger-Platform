import { EntityFromDb } from './entity';
import { User } from '../../../users/models/User';

export class LoginMapper {
  public static toDomain(entity: EntityFromDb): User {
    return {
      id: entity._id.toString(),
      login: entity.login,
      email: entity.email,
      password: entity.password,
      createdAt: entity.createdAt,
    };
  }
}
