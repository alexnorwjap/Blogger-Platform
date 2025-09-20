import express from 'express';
import { authorization } from '../../shared/middlewares/authorization';
import { postInputDtoValidation } from './posts.input-validation';
import { inputValidationResult } from '../../shared/middlewares/result-validation';
import { idValidation } from '../../shared/middlewares/id-validation';
import { getPost } from './handlers/get-post.handler';
import { getPostsList } from './handlers/get-posts-list.handler';
import { createPost } from './handlers/create-post.handler';
import { updatePost } from './handlers/update-post.handler';
import { deletePost } from './handlers/delete-post.handler';

export const getPostsRoutes = () => {
  const router = express.Router();

  router.get('/', getPostsList);

  router.get('/:id', idValidation, getPost);

  router.post(
    '/',
    authorization,
    postInputDtoValidation,
    inputValidationResult,
    createPost
  );

  router.put(
    '/:id',
    authorization,
    postInputDtoValidation,
    inputValidationResult,
    idValidation,
    updatePost
  );

  router.delete('/:id', authorization, idValidation, deletePost);

  return router;
};
