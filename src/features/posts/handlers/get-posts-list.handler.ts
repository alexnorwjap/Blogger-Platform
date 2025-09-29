import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { PostsViewModel } from '../posts.dto';
import { Response } from 'express';
import { RequestQuery } from '../../../shared/types/api.types';
import { postQueryRepository } from '../infrastructure/db/repositories/PostQueryRepositoryImpl';
import { queryParamsDto } from '../repositories/dto/queryPostDto';

export const getPostsList = async (req: RequestQuery<queryParamsDto>, res: Response<PostsViewModel>) => {
  const posts = await postQueryRepository.getAll(req.query);

  res.status(HTTP_STATUS_CODES.OK_200).send(posts);
};
