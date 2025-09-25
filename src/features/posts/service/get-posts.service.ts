import { PostsViewModel } from '../posts.dto';
import { PostQueryParams } from '../posts.types';
import { PostMongoQuery } from '../posts.types';
import { postsRepository } from '../posts.repositories';
import { toPostDTO } from '../posts.mappers';

const getPostsService = async (
  queryParams: PostQueryParams
): Promise<PostsViewModel> => {
  const {
    pageNumber = 1,
    pageSize = 10,
    sortBy = 'createdAt',
    sortDirection = 'desc',
  } = queryParams;
  const params: PostMongoQuery = {
    filter: {},
    sort: {
      [sortBy]: sortDirection === 'asc' ? 1 : -1,
    },
    skip: (+pageNumber - 1) * +pageSize,
    limit: +pageSize,
  };

  const posts = await postsRepository.getAllPosts(params);
  const count = await postsRepository.getPostsCount(params.filter);
  return {
    pagesCount: Math.ceil(count / +pageSize),
    page: +pageNumber,
    pageSize: +pageSize,
    totalCount: count,
    items: posts.map(toPostDTO),
  };
};

export { getPostsService };
