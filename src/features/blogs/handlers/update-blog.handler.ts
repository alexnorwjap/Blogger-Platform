import { validationResult } from 'express-validator';
import { RequestParams } from '../../../shared/types/api.types';
import { BlogId } from '../blogs.dto';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { updateBlogService } from '../service/update-blog.service';

export const updateBlog = async (req: RequestParams<BlogId>, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  const result = await updateBlogService(req.params.id, req.body);
  if (!result) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
};
