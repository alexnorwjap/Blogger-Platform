import { RequestBody } from '../../../shared/types/api.types';
import { PostBodyInput } from '../posts.dto';
import { PostBodyOutput } from '../posts.dto';
import { WrapValidErrorsType } from '../../../shared/types/errors-type';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { createdPostService } from '../service/created-post.service';

export const createPost = async (
  req: RequestBody<PostBodyInput>,
  res: Response<PostBodyOutput | WrapValidErrorsType>
) => {
  const result = await createdPostService(req.body);
  res.status(HTTP_STATUS_CODES.CREATED_201).send(result);
};
