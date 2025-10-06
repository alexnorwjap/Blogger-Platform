import { authModel } from '../model/meModel';

export interface AuthRepository {
  findByLoginOrEmail: (loginOrEmail: string) => Promise<authModel | null>;
}
