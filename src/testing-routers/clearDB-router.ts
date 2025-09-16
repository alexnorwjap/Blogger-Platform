import express, { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../shared/constants/http-status';
import db from '../db/db';

export const getClearDbRouter = () => {
  const router = express.Router();
  router.delete('/', (_req: Request, res: Response) => {
    db.blogs = [];
    db.posts = [];
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
  });
  return router;
};
