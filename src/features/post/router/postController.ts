import {
  AuthRequestParamsAndBody,
  RequestBody,
  RequestParams,
  RequestQuery,
} from '../../../shared/types/api.types';
import { queryParamsDto } from '../repositories/dto/queryRepoPostDto';
import { PostsViewModel } from '../models/PostsViewModel';
import { postQueryRepository } from '../database/repositories/PostQueryRepositoryImpl';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { WrapValidErrorsType } from '../../../shared/types/errors-type';
import { PostModel } from '../models/Post';
import { blogQueryRepository } from '../../blog/db/blogQueryRepositoryImpl';
import { postService } from '../service/postService';
import { InputPostDto } from '../service/serviceDto';
import { queryPostNormalize } from './helper/queryPostNormalize';
import { commentsQueryRepoImpl } from '../../comments/database/queryRepoImpl';
import { commentsService } from '../../comments/service/commentsService';
import { usersQueryRepository } from '../../users/infrastructure/db/repositories/UsersQueryRepoImpl';

class PostController {
  async getPostsList(req: RequestQuery<queryParamsDto>, res: Response<PostsViewModel>) {
    const posts = await postQueryRepository.getAll(queryPostNormalize(req.query));

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

  async getPost(req: RequestParams<{ id: string }>, res: Response<PostModel>) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    const result = await postQueryRepository.getPostById(req.params.id);
    if (!result) {
      console.log('resultMistakes', result);
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    console.log('resultSuccess', result);
    res.status(HTTP_STATUS_CODES.OK_200).send(result);
  }

  async createPost(req: RequestBody<InputPostDto>, res: Response<PostModel | WrapValidErrorsType>) {
    const blogExist = await blogQueryRepository.getBlogById(req.body.blogId);
    if (!blogExist) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    const result = await postService.createPost(req.body, blogExist.name);
    if (!result) {
      res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST400);
      return;
    }

    res.status(HTTP_STATUS_CODES.CREATED_201).send(result);
  }

  async updatePost(req: RequestParams<{ id: string }>, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST400);
      return;
    }
    const result = await postService.updatePost(req.params.id, req.body);
    if (!result) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
  }

  async deletePost(req: RequestParams<{ id: string }>, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    const result = await postService.deletePost(req.params.id);
    if (!result) {
      return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    }
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
  }

  async getCommentsByPostId(req: RequestParams<{ id: string }>, res: Response) {
    const post = await postQueryRepository.getPostById(req.params.id);
    if (!post) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }

    const result = await commentsQueryRepoImpl.getCommentsByPostId(req.params.id, queryPostNormalize(req.query));
    if (result.items.length === 0) {
      res.status(HTTP_STATUS_CODES.OK_200).send({
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [],
      });
      return;
    }
    res.status(HTTP_STATUS_CODES.OK_200).send(result);
  }

  async createCommentByPostId(req: AuthRequestParamsAndBody<{ id: string }, { content: string }>, res: Response) {
    const post = await postQueryRepository.getPostById(req.params.id);
    if (!post) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }

    const errors = validationResult(req as Request);
    if (!errors.isEmpty()) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }

    let currentUser;
    let currentCommentId;
    if (req.user) {
      currentUser = await usersQueryRepository.getUserById(req.user);
      currentCommentId = await commentsService.createCommentByPostId(req.params.id, req.body.content, {
        userId: currentUser!.id,
        userLogin: currentUser!.login,
      });
    }
    if (currentCommentId) {
      const result = await commentsQueryRepoImpl.getCommentById(currentCommentId);
      res.status(HTTP_STATUS_CODES.CREATED_201).send(result);
    }
  }
}

export const postController = new PostController();
