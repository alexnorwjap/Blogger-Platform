import { validationResult } from 'express-validator/lib/validation-result';
import { BlogQueryParam } from '../blogs.dto';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { blogsRepository } from '../blogs.repositories';
import { RequestParams } from '../../../shared/types/api.types';
import { Response } from 'express';
import { BlogBodyOutput } from '../blogs.dto';
import { toBlogDTO } from '../blogs.mappers';

export const getBlog = async (
  req: RequestParams<BlogQueryParam>,
  res: Response<BlogBodyOutput>
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  const result = await blogsRepository.getBlogById(req.params.id);
  if (!result) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  res.status(HTTP_STATUS_CODES.OK_200).send(toBlogDTO(result));
};
