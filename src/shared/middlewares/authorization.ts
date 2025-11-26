import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { CustomRequest } from '../types/api.types';
import { SETTINGS } from '../settings/settings';
const ADMIN_CREDENTIAL_BASE64 = Buffer.from(
  SETTINGS.ADMIN_USERNAME + ':' + SETTINGS.ADMIN_PASSWORD,
  'utf-8'
).toString('base64');

const authorization = (req: CustomRequest, res: Response, next: NextFunction) => {
  const auth =
    typeof req.headers['authorization'] === 'string' ? req.headers['authorization'] : null;

  if (!auth) return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send('Unauthorized');

  const [type, token] = auth.split(' ');
  if (type !== 'Basic') return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send('Unauthorized');

  if (ADMIN_CREDENTIAL_BASE64 !== token) {
    return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send('Unauthorized');
  }

  next();
};

export { authorization, ADMIN_CREDENTIAL_BASE64 };
