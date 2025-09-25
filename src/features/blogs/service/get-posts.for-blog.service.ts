import { postsRepository } from '../../posts/posts.repositories';
import { PostBodyOutput, PostsViewModel } from '../../posts/posts.dto';
import { toPostDTO } from '../../posts/posts.mappers';
import { PostMongoQuery, PostQueryParams } from '../../posts/posts.types';

const getPostsForBlogService = async (
  blogId: string,
  queryParams: PostQueryParams
): Promise<PostsViewModel> => {
  const {
    pageNumber = 1,
    pageSize = 10,
    sortBy = 'createdAt',
    sortDirection = 'desc',
  } = queryParams;
  const params: PostMongoQuery = {
    filter: { blogId },
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

export { getPostsForBlogService };
