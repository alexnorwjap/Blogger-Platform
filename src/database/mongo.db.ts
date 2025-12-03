import { SETTINGS } from '../shared/settings/settings';

import mongoose from 'mongoose';

export async function runDB(url: string): Promise<void> {
  try {
    await mongoose.connect(url, { dbName: SETTINGS.DB_NAME });
    console.log('✅ Connected to the database');
  } catch (e) {
    await mongoose.disconnect();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}
