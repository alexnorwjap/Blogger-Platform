import {
  AuthRequestParamsAndBody,
  RequestBody,
  AuthRequestParams,
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
import { inject, injectable } from 'inversify';
import { CommentsQueryService } from '../../comments/service/commentsQueryService';

@injectable()
export class PostController {
  constructor(
    @inject(PostQueryRepositoryImpl) readonly postQueryRepository: PostQueryRepositoryImpl,
    @inject(BlogQueryRepositoryImpl) readonly blogQueryRepository: BlogQueryRepositoryImpl,
    @inject(PostService) readonly postService: PostService,
    @inject(CommentsQueryService) readonly commentsQueryService: CommentsQueryService
  ) {}

  getPostsList = async (req: RequestQuery<queryParamsDto>, res: Response<PostsViewModel>) => {
    const posts = await this.postQueryRepository.getAll(queryPostNormalize(req.query));

    if (posts.items.length === 0) {
      return res.status(HTTP_STATUS_CODES.SUCCESS).send({
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [],
      });
    }
    res.status(HTTP_STATUS_CODES.SUCCESS).send(posts);
  };

  getPost = async (req: RequestParams<{ id: string }>, res: Response<PostModel>) => {
    const result = await this.postQueryRepository.getPostById(req.params.id);
    if (!result) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    res.status(HTTP_STATUS_CODES.SUCCESS).send(result);
  };

  createPost = async (req: RequestBody<InputPostDto>, res: Response<PostModel>) => {
    const blog = await this.blogQueryRepository.getBlogById(req.body.blogId);
    if (!blog) return res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST);

    const createPostResult = await this.postService.createPost(
      {
        ...req.body,
      },
      blog.name
    );
    if (!createPostResult.data) return res.sendStatus(HTTP_STATUS_CODES[createPostResult.status]);

    const post = await this.postQueryRepository.getPostById(createPostResult.data);
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

  getCommentsByPostId = async (req: AuthRequestParams<{ id: string }>, res: Response) => {
    const statuses = await this.postService.getStatusesByPostId(req.params.id, req?.user || null);
    if (!statuses.data) return res.sendStatus(HTTP_STATUS_CODES[statuses.status]);

    const result = await this.commentsQueryService.getCommentsAndStatusesByPostId(
      statuses.data.postId,
      queryPostNormalize(req.query!),
      statuses.data.statusData
    );

    res.status(HTTP_STATUS_CODES[result.status]).send(result.data);
  };

  createCommentByPostId = async (
    req: AuthRequestParamsAndBody<{ id: string }, { content: string }>,
    res: Response
  ) => {
    const createCommentResult = await this.postService.createCommentByPostId(
      req.params.id,
      req.body.content,
      req.user!
    );

    if (!createCommentResult.data) {
      return res.sendStatus(HTTP_STATUS_CODES[createCommentResult.status]);
    }

    const result = await this.commentsQueryService.getCommentByIdWithStatus(
      createCommentResult.data,
      req.user || null
    );
    if (!result) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    res.status(HTTP_STATUS_CODES[createCommentResult.status]).send(result);
  };
}
