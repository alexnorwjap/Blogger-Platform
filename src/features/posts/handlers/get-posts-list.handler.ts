import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { postsRepository } from '../posts.repositories';
import { toPostDTO } from '../posts.mappers';
import { PostBodyOutput } from '../posts.dto';
import { Request, Response } from 'express';

export const getPostsList = async (
  req: Request,
  res: Response<PostBodyOutput[]>
) => {
  const posts = await postsRepository.getAllPosts();
  res.status(HTTP_STATUS_CODES.OK_200).send(posts.map(toPostDTO));
};
