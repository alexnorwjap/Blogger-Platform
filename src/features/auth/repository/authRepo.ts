import { authModel } from '../model/authModel';

export interface AuthRepository {
  findByLoginOrEmail: (loginOrEmail: string) => Promise<authModel | null>;
}
