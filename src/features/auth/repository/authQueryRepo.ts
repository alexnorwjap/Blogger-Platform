import { AuthViewModel } from '../authType';

export interface AuthQueryRepository {
  getUserById(userId: string): Promise<AuthViewModel | null>;
}
