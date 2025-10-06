import express from 'express';
import { blogInputDtoValidation } from './validation/blogValidation';
import { inputValidationResult } from '../../../shared/middlewares/result-validation';
import { authorization } from '../../../shared/middlewares/authorization';
import { idValidation } from '../../../shared/middlewares/id-validation';
import { postInputDtoValidationForBlog } from './validation/postValidationForBlog';
import { blogController } from './blogController';

export const getBlogsRoutes = () => {
  const router = express.Router();

  router.get('/', blogController.getBlogsList);

  router.get('/:id/posts', idValidation, blogController.getPostsForBlog);

  router.get('/:id', idValidation, blogController.getBlog);

  router.post(
    '/:id/posts',
    authorization,
    postInputDtoValidationForBlog,
    inputValidationResult,
    idValidation,
    blogController.createPostForBlog
  );
  router.post('/', authorization, blogInputDtoValidation, inputValidationResult, blogController.createBlog);

  router.put(
    '/:id',
    authorization,
    blogInputDtoValidation,
    inputValidationResult,
    idValidation,
    blogController.updateBlog
  );

  router.delete('/:id', authorization, idValidation, blogController.deleteBlog);

  return router;
};
