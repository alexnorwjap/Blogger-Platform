import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { BlogsViewModel } from '../models/BlogsViewModel'; // fix if output change
import { RequestQuery } from '../../../shared/types/api.types';
import { Response, NextFunction } from 'express';
import { blogQueryRepository } from '../infrastructure/db/BlogQueryRepositoryImpl';
import { queryParamsDto } from '../repositories/dto/queryBlogDto'; // improve type itself?

export const getBlogsList = async (
  req: RequestQuery<queryParamsDto>,
  res: Response<BlogsViewModel>,
  next: NextFunction
) => {
  console.log(req.query);
  const blogs = await blogQueryRepository.getAll(req.query);

  if (blogs.items.length === 0) {
    res.status(HTTP_STATUS_CODES.OK_200).send({
      pagesCount: 0,
      page: 0,
      pageSize: 0,
      totalCount: 0,
      items: [],
    });
    return;
  }
  res.status(HTTP_STATUS_CODES.OK_200).send(blogs);
};
