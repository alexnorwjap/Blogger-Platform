import { validationResult } from 'express-validator';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { NextFunction, Response } from 'express';
import { BlogModel } from '../models/Blog';
import {
  RequestBody,
  RequestParams,
  RequestParamsAndBody,
  RequestParamsAndQuery,
  RequestQuery,
} from '../../../shared/types/api.types';
import { BlogId, BlogUpdateDto } from './../repositories/dto/blogDto';
import { InputBlogDto } from '../service/blogServiceDto';
import { blogQueryRepository } from '../db/blogQueryRepositoryImpl';
import { BlogsViewModel } from '../models/BlogsViewModel';
import { queryParamsDto } from '../repositories/dto/queryBlogDto';
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
  async getBlog(req: RequestParams<BlogId>, res: Response<BlogModel>) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    const result = await blogQueryRepository.getBlogById(req.params.id);
    if (!result) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    res.status(HTTP_STATUS_CODES.OK_200).send(result);
  }
  async getBlogsList(req: RequestQuery<QueryParamsInput>, res: Response<BlogsViewModel>, next: NextFunction) {
    const blogs = await blogQueryRepository.getAll(queryBlogsNormalize(req.query));

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
  }
  async createBlog(req: RequestBody<InputBlogDto>, res: Response<BlogModel | WrapValidErrorsType>) {
    const newBlog = await blogService.createBlog(req.body);
    if (!newBlog) {
      res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST400);
      return;
    }
    res.status(HTTP_STATUS_CODES.CREATED_201).send(newBlog);
  }
  async deleteBlog(req: RequestParams<BlogId>, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    const result = await blogService.deleteBlog(req.params.id);
    if (!result) {
      return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    }
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
  }
  async updateBlog(req: RequestParamsAndBody<BlogId, BlogUpdateDto>, res: Response) {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    const result = await blogService.updateBlog(req.params.id, req.body);
    if (!result) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
  }

  async getPostsForBlog(req: RequestParamsAndQuery<BlogId, queryParamsDto>, res: Response<PostsViewModel>) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    const currentBlog = await blogQueryRepository.getBlogById(req.params.id);
    if (!currentBlog) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    const posts = await postQueryRepository.getAllPostsByBlogId(req.params.id, queryPostNormalize(req.query));
    if (posts.items.length === 0) {
      res.status(HTTP_STATUS_CODES.OK_200).send({
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [],
      });
      return;
    }

    res.status(HTTP_STATUS_CODES.OK_200).send(posts);
  }
  async createPostForBlog(
    req: RequestParamsAndBody<BlogId, InputPostDtoByBlogId>,
    res: Response<PostModel | WrapValidErrorsType>
  ) {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    const currentBlog = await blogQueryRepository.getBlogById(req.params.id);
    if (!currentBlog) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    const result = await postService.createPostByBlogId(req.body, currentBlog.name, req.params.id);
    if (!result) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    res.status(HTTP_STATUS_CODES.CREATED_201).send(result);
  }
}

export const blogController = new BlogController();
