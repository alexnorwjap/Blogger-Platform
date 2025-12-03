import { User } from './userEntity';
import { AuthViewModel } from '../authType';

export class AuthQueryMapper {
  public static toViewModel(user: User): AuthViewModel {
    return {
      login: user.login,
      email: user.email,
      userId: user._id.toString(),
    };
  }
}
