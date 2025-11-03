import express, { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../shared/constants/http-status';

import { blogCollection, requestLogCollection, userCollection } from '../db/mongo.db';
import { postCollection } from '../db/mongo.db';

export const getClearDbRouter = () => {
  const router = express.Router();
  router.delete('/', async (_req: Request, res: Response) => {
    await blogCollection.deleteMany({});
    await userCollection.deleteMany({});
    await postCollection.deleteMany({});
    await requestLogCollection.deleteMany({});
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
  });
  return router;
};
