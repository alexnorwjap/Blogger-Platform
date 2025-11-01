import express from 'express';
import { commentsController } from './commentsController';
import { authorizationBearer } from '../../../shared/middlewares/authorizationBearer';
import { contentCommentValidation } from '../../../features/post/router/postValidation';
import { inputValidationResult } from '../../../shared/middlewares/result-validation';
import { idValidation } from '../../../shared/middlewares/id-validation';
import { resultIdValidation } from '../../../shared/middlewares/resultIdValidation';

export const commentsRoutes = () => {
  const router = express.Router();

  router.get('/:id', idValidation, resultIdValidation, commentsController.getCommentById);
  router.put(
    '/:id',
    authorizationBearer,
    contentCommentValidation,
    inputValidationResult,
    idValidation,
    resultIdValidation,
    commentsController.updateComment
  );
  router.delete(
    '/:id',
    authorizationBearer,
    idValidation,
    resultIdValidation,
    commentsController.deleteComment
  );

  return router;
};
