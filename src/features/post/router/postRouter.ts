import express from 'express';
import { authorization } from '../../../shared/middlewares/authorization';
import { postInputDtoValidation } from './postValidation';
import { inputValidationResult } from '../../../shared/middlewares/result-validation';
import { idValidation } from '../../../shared/middlewares/id-validation';
import { PostController } from './postController';
import { authorizationBearer } from '../../../shared/middlewares/authorizationBearer';
import { contentCommentValidation } from './postValidation';
import { resultIdValidation } from '../../../shared/middlewares/resultIdValidation';
import container from '../../../ioc';
import { userFromBearer } from '../../../shared/middlewares/userFromBearer';
import { codeLikeValidation } from '../../comments/router/validation/codeLikeValidation';

const postController = container.get<PostController>(PostController);

export const getPostsRoutes = () => {
  const router = express.Router();

  router.get('/', userFromBearer, postController.getPostsList);

  router.get(
    '/:id/comments',
    idValidation,
    resultIdValidation,
    userFromBearer,
    postController.getCommentsByPostId
  );

  router.get('/:id', userFromBearer, idValidation, resultIdValidation, postController.getPost);

  router.post(
    '/:id/comments',
    authorizationBearer,
    contentCommentValidation,
    inputValidationResult,
    idValidation,
    resultIdValidation,
    postController.createCommentByPostId
  );

  router.post(
    '/',
    authorization,
    postInputDtoValidation,
    inputValidationResult,
    postController.createPost
  );

  router.put(
    '/:id/like-status',
    authorizationBearer,
    idValidation,
    resultIdValidation,
    codeLikeValidation,
    inputValidationResult,
    postController.updateLikeStatusPost
  );

  router.put(
    '/:id',
    authorization,
    postInputDtoValidation,
    inputValidationResult,
    idValidation,
    resultIdValidation,
    postController.updatePost
  );

  router.delete('/:id', authorization, idValidation, resultIdValidation, postController.deletePost);

  return router;
};
