import { BlogBodyInput, BlogBodyOutput } from '../blogs.dto';
import { RequestBody } from '../../../shared/types/api.types';
import { WrapValidErrorsType } from '../../../shared/types/errors-type';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { createBlogService } from '../service/create-blog.service';

export const createBlog = async (
  req: RequestBody<BlogBodyInput>,
  res: Response<BlogBodyOutput | WrapValidErrorsType>
) => {
  const newBlog = await createBlogService(req.body);
  if (!newBlog) {
    res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST400);
    return;
  }
  res.status(HTTP_STATUS_CODES.CREATED_201).send(newBlog);
};
