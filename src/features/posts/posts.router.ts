import express, { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../shared/constants/http-status';
import { postsRepository } from './posts.repositories';
import { RequestParams } from '../../shared/types/api.types';
import { PostBodyOutput, PostQueryParam, PostBodyInput } from './posts.dto';
import { toPostDTO } from './posts.mappers';
import { authorization } from '../../shared/middlewares/authorization';
import { postInputDtoValidation } from './posts.input-validation';
import { inputValidationResult } from '../../shared/middlewares/result-validation';
import { RequestBody } from '../../shared/types/api.types';
import { WrapValidErrorsType } from '../../shared/types/errors-type';

export const getPostsRoutes = () => {
  const router = express.Router();

  router.get('/', (req: Request, res: Response<PostBodyOutput[]>) => {
    res
      .status(HTTP_STATUS_CODES.OK_200)
      .send(postsRepository.getAllPosts().map(toPostDTO));
  });

  router.get(
    '/:id',
    (req: RequestParams<PostQueryParam>, res: Response<PostBodyOutput>) => {
      const result = postsRepository.getPostById(Number(req.params.id));
      if (!result) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
        return;
      }
      res.status(HTTP_STATUS_CODES.OK_200).send(toPostDTO(result));
    }
  );

  router.post(
    '/',
    authorization,
    postInputDtoValidation,
    inputValidationResult,
    (
      req: RequestBody<PostBodyInput>,
      res: Response<PostBodyOutput | WrapValidErrorsType>
    ) => {
      const result = postsRepository.createPost(req.body);
      res.status(HTTP_STATUS_CODES.CREATED_201).send(toPostDTO(result));
    }
  );

  router.put(
    '/:id',
    authorization,
    postInputDtoValidation,
    inputValidationResult,
    (req: RequestParams<PostQueryParam>, res: Response) => {
      const result = postsRepository.updatePost(Number(req.params.id), req.body);
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
    (req: RequestParams<PostQueryParam>, res: Response) => {
      const result = postsRepository.deletePost(Number(req.params.id));
      if (!result) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
        return;
      }
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
    }
  );

  return router;
};
