import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { Response } from 'express';
import {
  RequestBody,
  RequestParams,
  RequestParamsAndBody,
  RequestQuery,
} from '../../../shared/types/api.types';
import { BlogId, BlogUpdateDto } from './../repositories/dto/blogDto';
import { InputBlogDto } from '../service/blogServiceDto';
import { BlogQueryRepositoryImpl } from '../db/blogQueryRepositoryImpl';
import { BlogsViewModel, BlogViewModel } from '../models/BlogsViewModel';
import { BlogService } from '../service/blogService';
import { WrapValidErrorsType } from '../../../shared/types/errors-type';
import { PostsViewModel, PostViewModel } from '../../post/models/PostsViewModel';
import { PostQueryRepositoryImpl } from '../../post/database/repositories/PostQueryRepositoryImpl';
import { PostService } from '../../post/service/postService';
import { queryBlogsNormalize, QueryParamsInput } from './helper/queryNormalize';
import { InputPostDtoByBlogId } from '../../post/service/serviceDto';
import { queryPostNormalize } from '../../post/router/helper/queryPostNormalize';
import { inject, injectable } from 'inversify';
import { AuthRequestParams } from '../../../shared/types/api.types';
import { queryParamsDto } from '../../post/repositories/dto/queryRepoPostDto';

@injectable()
export class BlogController {
  constructor(
    @inject(BlogQueryRepositoryImpl) readonly blogQueryRepository: BlogQueryRepositoryImpl,
    @inject(BlogService) readonly blogService: BlogService,
    @inject(PostQueryRepositoryImpl) readonly postQueryRepository: PostQueryRepositoryImpl,
    @inject(PostService) readonly postService: PostService
  ) {}

  getBlog = async (req: RequestParams<BlogId>, res: Response<BlogViewModel>) => {
    const blog = await this.blogQueryRepository.getBlogById(req.params.id);
    if (!blog) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    res.status(HTTP_STATUS_CODES.SUCCESS).send(blog);
  };

  getBlogsList = async (req: RequestQuery<QueryParamsInput>, res: Response<BlogsViewModel>) => {
    const blogs = await this.blogQueryRepository.getAll(queryBlogsNormalize(req.query));
    if (blogs.items.length === 0) {
      return res.status(HTTP_STATUS_CODES.SUCCESS).send({
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [],
      });
    }
    res.status(HTTP_STATUS_CODES.SUCCESS).send(blogs);
  };

  createBlog = async (req: RequestBody<InputBlogDto>, res: Response<BlogViewModel>) => {
    const createBlogResult = await this.blogService.createBlog(req.body);
    if (!createBlogResult.data) return res.sendStatus(HTTP_STATUS_CODES[createBlogResult.status]);

    const blog = await this.blogQueryRepository.getBlogById(createBlogResult.data);
    if (!blog) return res.sendStatus(HTTP_STATUS_CODES[createBlogResult.status]);

    res.status(HTTP_STATUS_CODES[createBlogResult.status]).send(blog);
  };

  deleteBlog = async (req: RequestParams<BlogId>, res: Response) => {
    const resultDeleteBlog = await this.blogService.deleteBlog(req.params.id);
    if (!resultDeleteBlog.data) return res.sendStatus(HTTP_STATUS_CODES[resultDeleteBlog.status]);

    res.sendStatus(HTTP_STATUS_CODES[resultDeleteBlog.status]);
  };

  updateBlog = async (req: RequestParamsAndBody<BlogId, BlogUpdateDto>, res: Response) => {
    const resultUpdateBlog = await this.blogService.updateBlog(req.params.id, req.body);
    if (!resultUpdateBlog.data) return res.sendStatus(HTTP_STATUS_CODES[resultUpdateBlog.status]);

    res.sendStatus(HTTP_STATUS_CODES[resultUpdateBlog.status]);
  };

  getPostsForBlog = async (
    req: AuthRequestParams<BlogId> & { query: queryParamsDto },
    res: Response<PostsViewModel>
  ) => {
    const currentBlog = await this.blogQueryRepository.getBlogById(req.params.id);
    if (!currentBlog) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    let statuses: Map<string, string> | null = null;
    if (req.user) {
      statuses = await this.postService.getStatusesForPostsByUserId(req.user);
    }
    const newestLikes = await this.postService.getNewestStatusesForPosts(req.params.id);

    const posts = await this.postQueryRepository.getAll(
      queryPostNormalize(req.query),
      req.params.id,
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

  createPostForBlog = async (
    req: RequestParamsAndBody<BlogId, InputPostDtoByBlogId>,
    res: Response<PostViewModel | WrapValidErrorsType>
  ) => {
    const blog = await this.blogQueryRepository.getBlogById(req.params.id);
    if (!blog) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    const createPostResult = await this.blogService.createPostForBlog(
      {
        ...req.body,
        blogId: blog.id,
      },
      blog.name
    );
    if (!createPostResult.data) return res.sendStatus(HTTP_STATUS_CODES[createPostResult.status]);

    const post = await this.postQueryRepository.getPostById(createPostResult.data, null, []);
    if (!post) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    res.status(HTTP_STATUS_CODES[createPostResult.status]).send(post);
  };
}
