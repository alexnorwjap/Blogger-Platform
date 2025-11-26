import {
  RequestLogEntity,
  requestLogSchema,
} from '../features/request-log/database/entities/requestEntities';
import { SETTINGS } from '../shared/settings/settings';

import mongoose from 'mongoose';
import { authSchema, entityDB as AuthEntityDB } from '../features/auth/database/authEntity';

export const userModel = mongoose.model<AuthEntityDB>('User', authSchema);
export const requestLogModel = mongoose.model<RequestLogEntity>('RequestLog', requestLogSchema);

export async function runDB(url: string): Promise<void> {
  try {
    await mongoose.connect(url, { dbName: SETTINGS.DB_NAME });
    console.log('✅ Connected to the database');
  } catch (e) {
    await mongoose.disconnect();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}
