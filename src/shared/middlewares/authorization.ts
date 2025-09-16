import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants/http-status';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';
const ADMIN_CREDENTIAL_BASE64 = Buffer.from(
  ADMIN_USERNAME + ':' + ADMIN_PASSWORD,
  'utf-8'
).toString('base64');

const authorization = (req: Request, res: Response, next: NextFunction) => {
  const auth =
    typeof req.headers['authorization'] === 'string'
      ? req.headers['authorization']
      : null;

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
