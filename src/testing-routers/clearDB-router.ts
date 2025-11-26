import express, { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../shared/constants/http-status';

import { requestLogModel, userModel } from '../db/mongo.db';
import { BlogModelEntity } from '../features/blog/db/blogEntitiy';
import { PostModelEntity } from '../features/post/database/entity/postEntities';
import { DeviceModelEntity } from '../features/device/database/deviceEntity';

export const getClearDbRouter = () => {
  const router = express.Router();
  router.delete('/', async (_req: Request, res: Response) => {
    await BlogModelEntity.deleteMany({});
    await userModel.deleteMany({});
    await PostModelEntity.deleteMany({});
    await DeviceModelEntity.deleteMany({});
    await requestLogModel.deleteMany({});
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
  });
  return router;
};
