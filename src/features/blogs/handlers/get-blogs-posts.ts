import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { Response } from 'express';
import { RequestParams } from '../../../shared/types/api.types';
import { BlogId } from '../blogs.dto';
import { validationResult } from 'express-validator';
import { getPostsForBlogService } from '../service/get-posts.for-blog.service';
import { PostBodyOutput, PostsViewModel } from '../../posts/posts.dto';

async function getBlogPosts(
  req: RequestParams<BlogId>,
  res: Response<PostsViewModel>
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  const queryParams = req.query;
  const posts = await getPostsForBlogService(req.params.id, queryParams);
  if (posts.items.length === 0) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }

  res.status(HTTP_STATUS_CODES.OK_200).send(posts);
}

export { getBlogPosts };
