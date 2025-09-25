import { WrapValidErrorsType } from '../../../shared/types/errors-type';
import { PostBodyOutput } from '../../posts/posts.dto';
import { Response } from 'express';
import { PostBodyInputForBlog } from '../blogs.dto';
import { createdPostService } from '../../posts/service/created-post.service';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { RequestParamsAndBody } from '../../../shared/types/api.types';
import { BlogId } from '../blogs.dto';
import { validationResult } from 'express-validator';

const createPostForBlog = async (
  req: RequestParamsAndBody<BlogId, PostBodyInputForBlog>,
  res: Response<PostBodyOutput | WrapValidErrorsType>
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  const result = await createdPostService({ ...req.body, blogId: req.params.id });
  if (!result) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  res.status(HTTP_STATUS_CODES.CREATED_201).send(result);
};

export { createPostForBlog };
