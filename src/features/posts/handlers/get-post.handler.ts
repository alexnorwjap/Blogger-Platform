import { RequestParams } from '../../../shared/types/api.types';
import { PostBodyOutput, PostId } from '../posts.dto';
import { Response } from 'express';
import { validationResult } from 'express-validator';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { postQueryRepository } from '../infrastructure/db/repositories/PostQueryRepositoryImpl';

export const getPost = async (req: RequestParams<PostId>, res: Response<PostBodyOutput>) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  const result = await postQueryRepository.getPostById(req.params.id);
  if (!result) {
    console.log('resultMistakes', result);
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  console.log('resultSuccess', result);
  res.status(HTTP_STATUS_CODES.OK_200).send(result);
};
