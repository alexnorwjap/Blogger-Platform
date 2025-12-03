import express, { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../shared/constants/http-status';

import { UserModel } from '../features/auth/database/userEntity';
import { BlogModel } from '../features/blog/db/blogEntitiy';
import { PostModel } from '../features/post/database/entity/postEntities';
import { DeviceModel } from '../features/device/database/deviceEntity';
import { RequestLogModel } from '../features/request-log/database/entities/requestEntities';

export const getClearDbRouter = () => {
  const router = express.Router();
  router.delete('/', async (_req: Request, res: Response) => {
    await BlogModel.deleteMany({});
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    await DeviceModel.deleteMany({});
    await RequestLogModel.deleteMany({});
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
  });
  return router;
};
