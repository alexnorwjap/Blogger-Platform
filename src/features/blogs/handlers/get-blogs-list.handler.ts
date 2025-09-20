import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { blogsRepository } from '../blogs.repositories';
import { BlogBodyOutput } from '../blogs.dto';
import { toBlogDTO } from '../blogs.mappers';
import { Response, Request } from 'express';

export const getBlogsList = async (
  req: Request,
  res: Response<BlogBodyOutput[]>
) => {
  const blogs = await blogsRepository.getAllBlogs();
  console.log('blogs', blogs);
  if (blogs.length === 0) {
    res.status(HTTP_STATUS_CODES.OK_200).send([]);
    return;
  }
  res.status(HTTP_STATUS_CODES.OK_200).send(blogs.map(toBlogDTO));
};
