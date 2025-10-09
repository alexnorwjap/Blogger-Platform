import { AuthViewModel } from './dto/authDto';
import { ObjectId } from 'mongodb';

export interface AuthQueryRepository {
  getProfile(userId: ObjectId): Promise<AuthViewModel | null>;
}
