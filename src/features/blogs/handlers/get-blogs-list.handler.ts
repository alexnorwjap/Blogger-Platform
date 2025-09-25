import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { blogsRepository } from '../blogs.repositories';
import { BlogBodyOutput, BlogsViewModel } from '../blogs.dto';
import { RequestQuery } from '../../../shared/types/api.types';
import { BlogQueryParams } from '../blogs.dto';
import { toBlogDTO } from '../blogs.mappers';
import { Response, Request, NextFunction } from 'express';
import { getBlogsService } from '../service/get-blogs.service';

export const getBlogsList = async (
  req: RequestQuery<BlogQueryParams>,
  res: Response<BlogsViewModel>,
  next: NextFunction
) => {
  console.log(req.query);
  const blogs = await getBlogsService(req.query);

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
