import { validationResult } from 'express-validator/lib/validation-result';
import { BlogId } from '../blogs.dto';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { RequestParams } from '../../../shared/types/api.types';
import { Response } from 'express';
import { BlogModel } from '../models/Blog'; // fix if output change
import { blogQueryRepository } from '../infrastructure/db/BlogQueryRepositoryImpl';

export const getBlog = async (req: RequestParams<BlogId>, res: Response<BlogModel>) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  const result = await blogQueryRepository.getBlogById(req.params.id);
  if (!result) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  res.status(HTTP_STATUS_CODES.OK_200).send(result);
};
