import { RequestParams } from '../../../shared/types/api.types';
import { PostQueryParam } from '../posts.dto';
import { Response } from 'express';
import { validationResult } from 'express-validator';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { postsRepository } from '../posts.repositories';

export const deletePost = async (
  req: RequestParams<PostQueryParam>,
  res: Response
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  const result = await postsRepository.deletePost(req.params.id);
  if (!result) {
    return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
  }
  res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
};
