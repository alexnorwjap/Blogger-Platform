import express from 'express';
import { blogInputDtoValidation } from './validation/blogValidation';
import { inputValidationResult } from '../../../shared/middlewares/result-validation';
import { authorization } from '../../../shared/middlewares/authorization';
import { idValidation } from '../../../shared/middlewares/id-validation';
import { postInputDtoValidationForBlog } from './validation/postValidationForBlog';
import { blogController } from './blogController';
import { resultIdValidation } from '../../../shared/middlewares/resultIdValidation';

export const getBlogsRoutes = () => {
  const router = express.Router();

  router.get('/', blogController.getBlogsList);

  router.get('/:id/posts', idValidation, resultIdValidation, blogController.getPostsForBlog);

  // review complete
  router.get('/:id', idValidation, resultIdValidation, blogController.getBlog);

  router.post(
    '/:id/posts',
    authorization,
    postInputDtoValidationForBlog,
    inputValidationResult,
    idValidation,
    resultIdValidation,
    blogController.createPostForBlog
  );
  router.post(
    '/',
    authorization,
    blogInputDtoValidation,
    inputValidationResult,
    blogController.createBlog
  );

  router.put(
    '/:id',
    authorization,
    blogInputDtoValidation,
    inputValidationResult,
    idValidation,
    resultIdValidation,
    blogController.updateBlog
  );

  router.delete('/:id', authorization, idValidation, resultIdValidation, blogController.deleteBlog);

  return router;
};
