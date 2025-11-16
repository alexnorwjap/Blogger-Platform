import {
  AuthRequestParamsAndBody,
  RequestBody,
  RequestParams,
  RequestQuery,
} from '../../../shared/types/api.types';
import { queryParamsDto } from '../repositories/dto/queryRepoPostDto';
import { PostsViewModel } from '../models/PostsViewModel';
import { PostQueryRepositoryImpl } from '../database/repositories/PostQueryRepositoryImpl';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { Response } from 'express';
import { PostModel } from '../models/Post';
import { BlogQueryRepositoryImpl } from '../../blog/db/blogQueryRepositoryImpl';
import { PostService } from '../service/postService';
import { InputPostDto } from '../service/serviceDto';
import { queryPostNormalize } from './helper/queryPostNormalize';
import { CommentsQueryRepoImpl } from '../../comments/database/commentsQueryRepoImpl';
import { CommentsService } from '../../comments/service/commentsService';
import { UsersQueryRepoImpl } from '../../users/infrastructure/db/repositories/UsersQueryRepoImpl';
import { inject, injectable } from 'inversify';

@injectable()
export class PostController {
  constructor(
    @inject(PostQueryRepositoryImpl) readonly postQueryRepository: PostQueryRepositoryImpl,
    @inject(BlogQueryRepositoryImpl) readonly blogQueryRepository: BlogQueryRepositoryImpl,
    @inject(PostService) readonly postService: PostService,
    @inject(CommentsQueryRepoImpl) readonly commentsQueryRepo: CommentsQueryRepoImpl,
    @inject(CommentsService) readonly commentsService: CommentsService,
    @inject(UsersQueryRepoImpl) readonly usersQueryRepository: UsersQueryRepoImpl
  ) {}

  getPostsList = async (req: RequestQuery<queryParamsDto>, res: Response<PostsViewModel>) => {
    const posts = await this.postQueryRepository.getAll(queryPostNormalize(req.query));

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
  };

  getPost = async (req: RequestParams<{ id: string }>, res: Response<PostModel>) => {
    const result = await this.postQueryRepository.getPostById(req.params.id);
    if (!result) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    res.status(HTTP_STATUS_CODES.SUCCESS).send(result);
  };

  createPost = async (req: RequestBody<InputPostDto>, res: Response<PostModel>) => {
    const blogExist = await this.blogQueryRepository.getBlogById(req.body.blogId);
    if (!blogExist) return res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST);

    const postIdResult = await this.postService.createPost(req.body, blogExist.name);
    if (!postIdResult.data) return res.sendStatus(HTTP_STATUS_CODES[postIdResult.status]);

    const post = await this.postQueryRepository.getPostById(postIdResult.data);
    if (!post) return res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST);

    res.status(HTTP_STATUS_CODES.CREATED).send(post);
  };

  updatePost = async (req: RequestParams<{ id: string }>, res: Response) => {
    const resultUpdate = await this.postService.updatePost(req.params.id, req.body);
    if (!resultUpdate.data) return res.sendStatus(HTTP_STATUS_CODES[resultUpdate.status]);

    res.sendStatus(HTTP_STATUS_CODES[resultUpdate.status]);
  };

  deletePost = async (req: RequestParams<{ id: string }>, res: Response) => {
    const resultDelete = await this.postService.deletePost(req.params.id);
    if (!resultDelete.data) return res.sendStatus(HTTP_STATUS_CODES[resultDelete.status]);

    res.sendStatus(HTTP_STATUS_CODES[resultDelete.status]);
  };

  getCommentsByPostId = async (req: RequestParams<{ id: string }>, res: Response) => {
    const post = await this.postQueryRepository.getPostById(req.params.id);
    if (!post) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    const result = await this.commentsQueryRepo.getCommentsByPostId(
      req.params.id,
      queryPostNormalize(req.query)
    );
    if (result.items.length === 0) {
      return res.status(HTTP_STATUS_CODES.SUCCESS).send({
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [],
      });
    }
    res.status(HTTP_STATUS_CODES.SUCCESS).send(result);
  };

  createCommentByPostId = async (
    req: AuthRequestParamsAndBody<{ id: string }, { content: string }>,
    res: Response
  ) => {
    const post = await this.postQueryRepository.getPostById(req.params.id);
    if (!post || !req.user) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    const currentUser = await this.usersQueryRepository.getUserById(req.user);
    if (!currentUser) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    const resultCreateComment = await this.commentsService.createCommentByPostId(
      req.params.id,
      req.body.content,
      currentUser
    );

    if (!resultCreateComment.data) {
      return res.sendStatus(HTTP_STATUS_CODES[resultCreateComment.status]);
    }

    const result = await this.commentsQueryRepo.getCommentById(resultCreateComment.data);
    if (!result) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    res.status(HTTP_STATUS_CODES[resultCreateComment.status]).send(result);
  };
}
