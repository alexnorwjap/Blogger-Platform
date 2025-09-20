import { RequestParams } from '../../../shared/types/api.types';
import { PostQueryParam, PostBodyOutput } from '../posts.dto';
import { Response } from 'express';
import { validationResult } from 'express-validator';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { postsRepository } from '../posts.repositories';
import { toPostDTO } from '../posts.mappers';

export const getPost = async (
  req: RequestParams<PostQueryParam>,
  res: Response<PostBodyOutput>
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  console.log(req.params.id);
  const result = await postsRepository.getPostById(req.params.id);
  if (!result) {
    console.log('resultMistakes', result);
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  console.log('resultSuccess', result);
  res.status(HTTP_STATUS_CODES.OK_200).send(toPostDTO(result));
};
