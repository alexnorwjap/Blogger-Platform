import express from 'express';
import { commentsController } from './commentsController';
import { authorizationBearer } from '../../../shared/middlewares/authorizationBearer';
import { contentCommentValidation } from '../../../features/post/router/postValidation';
import { inputValidationResult } from '../../../shared/middlewares/result-validation';
import { idValidation } from '../../../shared/middlewares/id-validation';

export const commentsRoutes = () => {
  const router = express.Router();

  router.get('/:id', idValidation, commentsController.getCommentById);
  router.put(
    '/:id',
    authorizationBearer,
    contentCommentValidation,
    inputValidationResult,
    idValidation,
    commentsController.updateComment
  );
  router.delete('/:id', authorizationBearer, idValidation, commentsController.deleteComment);

  return router;
};
