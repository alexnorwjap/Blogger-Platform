import express from 'express';
import { commentsController } from './commentsController';
import { authorizationBearer } from '../../../shared/middlewares/authorizationBearer';

export const commentsRoutes = () => {
  const router = express.Router();

  router.get('/:id', commentsController.getCommentById);
  router.put('/:id', authorizationBearer, commentsController.updateComment);
  router.delete('/:id', authorizationBearer, commentsController.deleteComment);

  return router;
};
