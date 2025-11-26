import express from 'express';
import { authorizationBearer } from '../../../shared/middlewares/authorizationBearer';
import { contentCommentValidation } from '../../../features/post/router/postValidation';
import { inputValidationResult } from '../../../shared/middlewares/result-validation';
import { idValidation } from '../../../shared/middlewares/id-validation';
import { resultIdValidation } from '../../../shared/middlewares/resultIdValidation';
import container from '../../../ioc';
import { CommentsController } from './commentsController';
import { codeLikeValidation } from './validation/codeLikeValidation';
import { userFromBearer } from '../../../shared/middlewares/userFromBearer';

const commentsController = container.get<CommentsController>(CommentsController);

export const commentsRoutes = () => {
  const router = express.Router();

  router.get(
    '/:id',
    userFromBearer,
    idValidation,
    resultIdValidation,
    commentsController.getCommentById
  );

  router.put(
    '/:id/like-status',
    authorizationBearer,
    idValidation,
    resultIdValidation,
    codeLikeValidation,
    inputValidationResult,
    commentsController.changeLikeStatus
  );
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
