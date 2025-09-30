import { User } from '../../../users/models/User';

export interface LoginRepository {
  findByLoginOrEmail: (loginOrEmail: string) => Promise<User | null>;
}
