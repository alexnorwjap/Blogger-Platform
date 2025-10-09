import express from 'express';
import { authorization } from '../../../shared/middlewares/authorization';
import { postInputDtoValidation } from './postValidation';
import { inputValidationResult } from '../../../shared/middlewares/result-validation';
import { idValidation } from '../../../shared/middlewares/id-validation';
import { postController } from './postController';
import { authorizationBearer } from '../../../shared/middlewares/authorizationBearer';
import { contentCommentValidation } from './postValidation';

export const getPostsRoutes = () => {
  const router = express.Router();

  router.get('/', postController.getPostsList);

  router.get('/:id/comments', idValidation, postController.getCommentsByPostId);

  router.get('/:id', idValidation, postController.getPost);

  router.post(
    '/:id/comments',
    authorizationBearer,
    contentCommentValidation,
    inputValidationResult,
    idValidation,
    postController.createCommentByPostId
  );

  router.post('/', authorization, postInputDtoValidation, inputValidationResult, postController.createPost);

  router.put(
    '/:id',
    authorization,
    postInputDtoValidation,
    inputValidationResult,
    idValidation,
    postController.updatePost
  );

  router.delete('/:id', authorization, idValidation, postController.deletePost);

  return router;
};
