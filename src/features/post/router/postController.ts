import {
  AuthRequestParamsAndBody,
  RequestBody,
  AuthRequestParams,
  RequestParams,
  UserRequest,
  RequestParamsAndBodyAndCustom,
} from '../../../shared/types/api.types';
import { queryParamsDto } from '../repositories/dto/queryRepoPostDto';
import { PostsViewModel } from '../models/PostsViewModel';
import { PostQueryRepositoryImpl } from '../database/repositories/PostQueryRepositoryImpl';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { Response } from 'express';
import { PostViewModel } from '../models/PostsViewModel';
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

  getPostsList = async (
    req: UserRequest & { query: queryParamsDto },
    res: Response<PostsViewModel>
  ) => {
    let statuses: Map<string, string> | null = null;
    if (req.user) {
      statuses = await this.postService.getStatusesForPostsByUserId(req.user);
    }
    const newestLikes = await this.postService.getNewestStatusesForPosts();
    const posts = await this.postQueryRepository.getAll(
      queryPostNormalize(req.query),
      null,
      statuses,
      newestLikes
    );

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

  getPost = async (req: AuthRequestParams<{ id: string }>, res: Response<PostViewModel>) => {
    let statuses: { [postId: string]: string } | null = null;
    if (req.user) {
      statuses = await this.postService.getStatusesForPost(req.params.id, req.user);
    }
    const newestLikes = await this.postService.getNewestLikesForPost(req.params.id);
    const result = await this.postQueryRepository.getPostById(req.params.id, statuses, newestLikes);
    if (!result) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    res.status(HTTP_STATUS_CODES.SUCCESS).send(result);
  };

  createPost = async (req: RequestBody<InputPostDto>, res: Response<PostViewModel>) => {
    const blog = await this.blogQueryRepository.getBlogById(req.body.blogId);
    if (!blog) return res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST);

    const createPostResult = await this.postService.createPost(
      {
        ...req.body,
      },
      blog.name
    );
    if (!createPostResult.data) return res.sendStatus(HTTP_STATUS_CODES[createPostResult.status]);

    const post = await this.postQueryRepository.getPostById(createPostResult.data, null, []);
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
    const userId = req.user ? req.user : null;

    const result = await this.commentsQueryService.getCommentsAndStatusesByPostId(
      userId,
      queryPostNormalize(req.query!),
      req.params.id
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

  updateLikeStatusPost = async (
    req: AuthRequestParamsAndBody<{ id: string }, { likeStatus: string }>,
    res: Response
  ) => {
    const result = await this.postService.updateLikeStatusPost(
      req.params.id,
      req.body.likeStatus,
      req.user!
    );
    if (!result.data) return res.sendStatus(HTTP_STATUS_CODES[result.status]);
    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  };
}
