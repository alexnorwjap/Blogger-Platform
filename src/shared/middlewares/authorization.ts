import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { CustomRequest } from '../types/api.types';
import { SETTINGS } from '../settings/settings';
const ADMIN_CREDENTIAL_BASE64 = Buffer.from(
  SETTINGS.ADMIN_USERNAME + ':' + SETTINGS.ADMIN_PASSWORD,
  'utf-8'
).toString('base64');

const authorization = (req: CustomRequest, res: Response, next: NextFunction) => {
  const auth = typeof req.headers['authorization'] === 'string' ? req.headers['authorization'] : null;

  if (!auth) {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED401).send('Unauthorized');
    return;
  }

  const [type, token] = auth.split(' ');
  if (type !== 'Basic') {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED401).send('Unauthorized');
    return;
  }

  if (ADMIN_CREDENTIAL_BASE64 !== token) {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED401).send('Unauthorized');
    return;
  }
  next();
};

export { authorization, ADMIN_CREDENTIAL_BASE64 };
