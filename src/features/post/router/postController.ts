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
import { Response } from 'express';
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

  async getPost(req: RequestParams<{ id: string }>, res: Response<PostModel>) {
    const result = await postQueryRepository.getPostById(req.params.id);
    if (!result) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
      return;
    }
    res.status(HTTP_STATUS_CODES.SUCCESS).send(result);
  }

  // review complete
  async createPost(req: RequestBody<InputPostDto>, res: Response<PostModel>) {
    const blogExist = await blogQueryRepository.getBlogById(req.body.blogId);
    if (!blogExist) {
      res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST);
      return;
    }
    const postIdResult = await postService.createPost(req.body, blogExist.name);
    if (!postIdResult.data) {
      res.sendStatus(HTTP_STATUS_CODES[postIdResult.status]);
      return;
    }
    const post = await postQueryRepository.getPostById(postIdResult.data);
    if (!post) {
      res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST);
      return;
    }
    res.status(HTTP_STATUS_CODES.CREATED).send(post);
  }

  // review complete
  async updatePost(req: RequestParams<{ id: string }>, res: Response) {
    const resultUpdate = await postService.updatePost(req.params.id, req.body);
    if (!resultUpdate.data) {
      res.sendStatus(HTTP_STATUS_CODES[resultUpdate.status]);
      return;
    }
    res.sendStatus(HTTP_STATUS_CODES[resultUpdate.status]);
  }

  // review complete
  async deletePost(req: RequestParams<{ id: string }>, res: Response) {
    const resultDelete = await postService.deletePost(req.params.id);
    if (!resultDelete.data) {
      return res.sendStatus(HTTP_STATUS_CODES[resultDelete.status]);
    }
    res.sendStatus(HTTP_STATUS_CODES[resultDelete.status]);
  }

  // review complete
  async getCommentsByPostId(req: RequestParams<{ id: string }>, res: Response) {
    const post = await postQueryRepository.getPostById(req.params.id);
    if (!post) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
      return;
    }
    const result = await commentsQueryRepoImpl.getCommentsByPostId(
      req.params.id,
      queryPostNormalize(req.query)
    );
    if (result.items.length === 0) {
      res.status(HTTP_STATUS_CODES.SUCCESS).send({
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [],
      });
      return;
    }
    res.status(HTTP_STATUS_CODES.SUCCESS).send(result);
  }

  // review complete
  async createCommentByPostId(
    req: AuthRequestParamsAndBody<{ id: string }, { content: string }>,
    res: Response
  ) {
    const post = await postQueryRepository.getPostById(req.params.id);
    if (!post || !req.user) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
      return;
    }

    const currentUser = await usersQueryRepository.getUserById(req.user);
    if (!currentUser) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
      return;
    }
    const resultCreateComment = await commentsService.createCommentByPostId(
      req.params.id,
      req.body.content,
      currentUser
    );

    if (resultCreateComment.data) {
      const result = await commentsQueryRepoImpl.getCommentById(resultCreateComment.data);
      res.status(HTTP_STATUS_CODES[resultCreateComment.status]).send(result);
    } else {
      res.sendStatus(HTTP_STATUS_CODES[resultCreateComment.status]);
      return;
    }
  }
}

export const postController = new PostController();
