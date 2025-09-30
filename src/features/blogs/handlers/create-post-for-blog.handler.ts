import { WrapValidErrorsType } from '../../../shared/types/errors-type';
import { PostModel } from '../../posts/models/Post'; // fix if output change
import { Response } from 'express';
import { PostInputForBlog } from '../blogs.dto';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { RequestParamsAndBody } from '../../../shared/types/api.types';
import { BlogId } from '../blogs.dto';
import { validationResult } from 'express-validator';
import { blogQueryRepository } from '../infrastructure/db/BlogQueryRepositoryImpl';
import { postService } from '../../posts/postService';

const createPostForBlog = async (
  req: RequestParamsAndBody<BlogId, PostInputForBlog>,
  res: Response<PostModel | WrapValidErrorsType>
) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  const currentBlog = await blogQueryRepository.getBlogById(req.params.id);
  if (!currentBlog) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  const result = await postService.createPostByBlogId(req.body, currentBlog.name, req.params.id);
  if (!result) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  res.status(HTTP_STATUS_CODES.CREATED_201).send(result);
};

export { createPostForBlog };
