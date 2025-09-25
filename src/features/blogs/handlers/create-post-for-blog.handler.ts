import { WrapValidErrorsType } from '../../../shared/types/errors-type';
import { PostBodyOutput } from '../../posts/posts.dto';
import { Response } from 'express';
import { PostBodyInputForBlog } from '../blogs.dto';
import { createdPostService } from '../../posts/service/created-post.service';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { RequestParamsAndBody } from '../../../shared/types/api.types';
import { BlogId } from '../blogs.dto';

const createPostForBlog = async (
  req: RequestParamsAndBody<BlogId, PostBodyInputForBlog>,
  res: Response<PostBodyOutput | WrapValidErrorsType>
) => {
  const result = await createdPostService({ ...req.body, blogId: req.params.id });
  res.status(HTTP_STATUS_CODES.CREATED_201).send(result);
};

export { createPostForBlog };
