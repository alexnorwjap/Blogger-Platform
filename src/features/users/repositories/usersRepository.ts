import { UserDocument } from '../../auth/database/userEntity';

export interface UsersRepository {
  save: (user: UserDocument) => Promise<UserDocument>;
  delete: (id: string) => Promise<boolean>;
  getUserById: (id: string) => Promise<UserDocument | null>;
  findByLoginOrEmail: (login: string, email: string) => Promise<UserDocument | null>;
}
