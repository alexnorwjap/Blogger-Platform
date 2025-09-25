import { BlogQueryParams } from '../blogs.dto';
import { blogsRepository } from '../blogs.repositories';
import { BlogMongoQuery } from '../blogs.types';
import { Blog } from '../blogs.types';
import { WithId } from 'mongodb';
import { BlogsViewModel } from '../blogs.dto';
import { toBlogDTO } from '../blogs.mappers';

const getBlogsService = async (
  queryParams: BlogQueryParams
): Promise<BlogsViewModel> => {
  const {
    searchNameTerm = null,
    sortBy = 'createdAt',
    sortDirection = 'desc',
    pageNumber = 1,
    pageSize = 10,
  } = queryParams;
  const params: BlogMongoQuery = {
    filter: searchNameTerm
      ? { name: { $regex: searchNameTerm, $options: 'i' } }
      : {},
    sort: {
      [sortBy]: sortDirection === 'asc' ? 1 : -1,
    },
    skip: (+pageNumber - 1) * +pageSize,
    limit: +pageSize,
  };
  const count = await blogsRepository.getBlogsCount(params.filter);

  const blogs = await blogsRepository.getBlogsWithQuery(params);

  return {
    pagesCount: Math.ceil(count / +pageSize),
    page: +pageNumber,
    pageSize: +pageSize,
    totalCount: count,
    items: blogs.map(toBlogDTO),
  };
};

export { getBlogsService };
