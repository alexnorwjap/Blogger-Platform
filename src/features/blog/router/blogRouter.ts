import express from 'express';
import { blogInputDtoValidation } from './validation/blogValidation';
import { inputValidationResult } from '../../../shared/middlewares/result-validation';
import { authorization } from '../../../shared/middlewares/authorization';
import { idValidation } from '../../../shared/middlewares/id-validation';
import { postInputDtoValidationForBlog } from './validation/postValidationForBlog';
import { resultIdValidation } from '../../../shared/middlewares/resultIdValidation';
import { BlogController } from './blogController';
import container from '../../../ioc';

const blogController = container.get<BlogController>(BlogController);

export const getBlogsRoutes = () => {
  const router = express.Router();

  router.get('/', blogController.getBlogsList);

  router.get('/:id/posts', idValidation, resultIdValidation, blogController.getPostsForBlog);

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
