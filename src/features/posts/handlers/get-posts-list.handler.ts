import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { postsRepository } from '../posts.repositories';
import { toPostDTO } from '../posts.mappers';
import { PostBodyOutput, PostsViewModel } from '../posts.dto';
import { Request, Response } from 'express';
import { RequestQuery } from '../../../shared/types/api.types';
import { getPostsService } from '../service/get-posts.service';
import { PostQueryParams } from '../posts.types';

export const getPostsList = async (
  req: RequestQuery<PostQueryParams>,
  res: Response<PostsViewModel>
) => {
  const posts = await getPostsService(req.query);

  res.status(HTTP_STATUS_CODES.OK_200).send(posts);
};
