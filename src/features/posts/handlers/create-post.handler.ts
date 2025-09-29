import { RequestBody } from '../../../shared/types/api.types';
import { PostBodyInput } from '../posts.dto';
import { WrapValidErrorsType } from '../../../shared/types/errors-type';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { postService } from '../postService';
import { blogQueryRepository } from '../../blogs/infrastructure/db/BlogQueryRepositoryImpl';
import { PostModel } from '../models/Post';

export const createPost = async (
  req: RequestBody<PostBodyInput>,
  res: Response<PostModel | WrapValidErrorsType>
) => {
  const blogExist = await blogQueryRepository.getBlogById(req.body.blogId);
  if (!blogExist) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  const result = await postService.createPost(req.body, blogExist.name);
  if (!result) {
    res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST400);
    return;
  }

  res.status(HTTP_STATUS_CODES.CREATED_201).send(result);
};
