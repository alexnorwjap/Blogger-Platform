import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export async function checkPassword(inputPassword: string, userPassword: string): Promise<boolean> {
  return bcrypt.compare(inputPassword, userPassword);
}

export function prepareDevice(): { deviceId: string; date: Date } {
  const deviceId = randomUUID();
  return {
    deviceId: deviceId,
    date: new Date(),
  };
}
