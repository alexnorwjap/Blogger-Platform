import express from 'express';
import { blogInputDtoValidation } from './blogs.input-validation';
import { inputValidationResult } from '../../shared/middlewares/result-validation';
import { authorization } from '../../shared/middlewares/authorization';
import { idValidation } from '../../shared/middlewares/id-validation';
import { createBlog } from './handlers/create-blog.handler';
import { deleteBlog } from './handlers/delete-blog.handler';
import { updateBlog } from './handlers/update-blog.handler';
import { getBlog } from './handlers/get-blog.handler';
import { getBlogsList } from './handlers/get-blogs-list.handler';

export const getBlogsRoutes = () => {
  const router = express.Router();

  router.get('/', getBlogsList);
  router.get('/:id', idValidation, getBlog);

  router.post(
    '/',
    authorization,
    blogInputDtoValidation,
    inputValidationResult,
    createBlog
  );

  router.put(
    '/:id',
    authorization,
    blogInputDtoValidation,
    inputValidationResult,
    idValidation,
    updateBlog
  );

  router.delete('/:id', authorization, idValidation, deleteBlog);

  return router;
};
