import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { Response } from 'express';
import { RequestParamsAndQuery } from '../../../shared/types/api.types';
import { BlogId } from '../blogs.dto';
import { validationResult } from 'express-validator';
import { PostsViewModel } from '../../posts/posts.dto'; // good? improve?
import { postQueryRepository } from '../../posts/infrastructure/db/repositories/PostQueryRepositoryImpl';
import { queryParamsDto } from '../../posts/repositories/dto/queryPostDto'; // improve type itself?

async function getBlogPosts(req: RequestParamsAndQuery<BlogId, queryParamsDto>, res: Response<PostsViewModel>) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }

  const posts = await postQueryRepository.getAllPostsByBlogId(req.params.id, req.query);
  if (posts.items.length === 0) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }

  res.status(HTTP_STATUS_CODES.OK_200).send(posts);
}

export { getBlogPosts };
