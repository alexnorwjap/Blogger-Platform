import { validationResult } from 'express-validator';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { NextFunction, Response } from 'express';
import { BlogModel } from '../models/Blog';
import {
  RequestBody,
  RequestParams,
  RequestParamsAndBody,
  RequestQuery,
} from '../../../shared/types/api.types';
import { BlogId, BlogUpdateDto } from './../repositories/dto/blogDto';
import { InputBlogDto } from '../service/blogServiceDto';
import { blogQueryRepository } from '../db/blogQueryRepositoryImpl';
import { BlogsViewModel } from '../models/BlogsViewModel';
import { blogService } from '../service/blogService';
import { WrapValidErrorsType } from '../../../shared/types/errors-type';
import { PostsViewModel } from '../../post/models/PostsViewModel';
import { postQueryRepository } from '../../post/database/repositories/PostQueryRepositoryImpl';
import { PostModel } from '../../post/models/Post';
import { postService } from '../../post/service/postService';
import { queryBlogsNormalize, QueryParamsInput } from './helper/queryNormalize';
import { InputPostDtoByBlogId } from '../../post/service/serviceDto';
import { queryPostNormalize } from '../../post/router/helper/queryPostNormalize';

class BlogController {
  // review complete
  async getBlog(req: RequestParams<BlogId>, res: Response<BlogModel>) {
    const result = await blogQueryRepository.getBlogById(req.params.id);
    if (!result) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
      return;
    }
    res.status(HTTP_STATUS_CODES.SUCCESS).send(result);
  }

  // review complete
  async getBlogsList(
    req: RequestQuery<QueryParamsInput>,
    res: Response<BlogsViewModel>,
    next: NextFunction
  ) {
    const blogs = await blogQueryRepository.getAll(queryBlogsNormalize(req.query));

    if (blogs.items.length === 0) {
      res.status(HTTP_STATUS_CODES.SUCCESS).send({
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [],
      });
      return;
    }
    res.status(HTTP_STATUS_CODES.SUCCESS).send(blogs);
  }

  // review complete
  async createBlog(req: RequestBody<InputBlogDto>, res: Response<BlogModel>) {
    const createBlogResult = await blogService.createBlog(req.body);
    if (!createBlogResult.data) {
      res.sendStatus(HTTP_STATUS_CODES[createBlogResult.status]);
      return;
    }
    const blog = await blogQueryRepository.getBlogById(createBlogResult.data);
    if (!blog) {
      res.sendStatus(HTTP_STATUS_CODES[createBlogResult.status]);
      return;
    }
    res.status(HTTP_STATUS_CODES[createBlogResult.status]).send(blog);
  }

  // review complete
  async deleteBlog(req: RequestParams<BlogId>, res: Response) {
    const resultDeleteBlog = await blogService.deleteBlog(req.params.id);
    if (!resultDeleteBlog.data) {
      res.sendStatus(HTTP_STATUS_CODES[resultDeleteBlog.status]);
      return;
    }
    res.sendStatus(HTTP_STATUS_CODES[resultDeleteBlog.status]);
  }
  // review complete
  async updateBlog(req: RequestParamsAndBody<BlogId, BlogUpdateDto>, res: Response) {
    const resultUpdateBlog = await blogService.updateBlog(req.params.id, req.body);
    if (!resultUpdateBlog.data) {
      res.sendStatus(HTTP_STATUS_CODES[resultUpdateBlog.status]);
      return;
    }
    res.sendStatus(HTTP_STATUS_CODES[resultUpdateBlog.status]);
  }
  // review complete
  async getPostsForBlog(req: RequestParams<BlogId>, res: Response<PostsViewModel>) {
    const currentBlog = await blogQueryRepository.getBlogById(req.params.id);
    if (!currentBlog) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
      return;
    }
    const posts = await postQueryRepository.getAllPostsByBlogId(
      req.params.id,
      queryPostNormalize(req.query)
    );
    if (posts.items.length === 0) {
      res.status(HTTP_STATUS_CODES.SUCCESS).send({
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [],
      });
      return;
    }

    res.status(HTTP_STATUS_CODES.SUCCESS).send(posts);
  }

  // review complete
  async createPostForBlog(
    req: RequestParamsAndBody<BlogId, InputPostDtoByBlogId>,
    res: Response<PostModel | WrapValidErrorsType>
  ) {
    const currentBlog = await blogQueryRepository.getBlogById(req.params.id);
    if (!currentBlog) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
      return;
    }
    const result = await postService.createPostByBlogId(req.body, currentBlog.name, req.params.id);
    if (!result.data) {
      res.sendStatus(HTTP_STATUS_CODES[result.status]);
      return;
    }
    const post = await postQueryRepository.getPostById(result.data);
    if (!post) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
      return;
    }
    res.status(HTTP_STATUS_CODES[result.status]).send(post);
  }
}

export const blogController = new BlogController();
