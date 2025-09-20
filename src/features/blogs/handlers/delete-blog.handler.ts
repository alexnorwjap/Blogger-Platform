import { validationResult } from 'express-validator';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { blogsRepository } from '../blogs.repositories';
import { BlogQueryParam } from '../blogs.dto';
import { RequestParams } from '../../../shared/types/api.types';
import { Response } from 'express';

export const deleteBlog = async (
  req: RequestParams<BlogQueryParam>,
  res: Response
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  const result = await blogsRepository.deleteBlog(req.params.id);
  if (!result) {
    return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
  }
  res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
};
