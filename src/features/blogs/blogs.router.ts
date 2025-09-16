import express, { Request, Response } from 'express';
import { BlogQueryParam, BlogBodyOutput, BlogBodyInput } from './blogs.dto';
import { RequestParams, RequestBody } from '../../shared/types/api.types';
import { blogsRepository } from './blogs.repositories';
import { HTTP_STATUS_CODES } from '../../shared/constants/http-status';
import { toBlogDTO } from './blogs.mappers';
import { blogInputDtoValidation } from './blogs.input-validation';
import { inputValidationResult } from '../../shared/middlewares/result-validation';
import { WrapValidErrorsType } from '../../shared/types/errors-type';
import { authorization } from '../../shared/middlewares/authorization';

export const getBlogsRoutes = () => {
  const router = express.Router();

  router.get('/', (req: Request, res: Response<BlogBodyOutput[]>) => {
    res
      .status(HTTP_STATUS_CODES.OK_200)
      .send(blogsRepository.getAllBlogs().map(toBlogDTO));
  });

  router.get(
    '/:id',
    (req: RequestParams<BlogQueryParam>, res: Response<BlogBodyOutput>) => {
      const result = blogsRepository.getBlogById(Number(req.params.id));
      if (!result) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
        return;
      }
      res.status(HTTP_STATUS_CODES.OK_200).send(toBlogDTO(result));
    }
  );

  router.post(
    '/',
    authorization,
    blogInputDtoValidation,
    inputValidationResult,
    (
      req: RequestBody<BlogBodyInput>,
      res: Response<BlogBodyOutput | WrapValidErrorsType>
    ) => {
      const newBlog = blogsRepository.createBlog(req.body);
      if (!newBlog) {
        res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST400);
        return;
      }
      res.status(HTTP_STATUS_CODES.CREATED_201).send(toBlogDTO(newBlog));
    }
  );

  router.put(
    '/:id',
    authorization,
    blogInputDtoValidation,
    inputValidationResult,
    (req: RequestParams<BlogQueryParam>, res: Response) => {
      const result = blogsRepository.updateBlog(Number(req.params.id), req.body);
      if (!result) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
        return;
      }
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
    }
  );

  router.delete(
    '/:id',
    authorization,
    (req: RequestParams<BlogQueryParam>, res: Response) => {
      const result = blogsRepository.deleteBlog(Number(req.params.id));
      if (!result) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
        return;
      }
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
    }
  );

  return router;
};
