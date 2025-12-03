import { PostRepositoryImpl } from '../database/repositories/PostRepositoryImpl';
import { InputPostDto } from './serviceDto';
import { UpdatePostDto } from '../repositories/dto/postRepoDto';
import { createResult, Result } from '../../../shared/utils/result-object';
import { inject, injectable } from 'inversify';
import { LikeCommentService } from '../../comment-likes/likeService';
import { UsersService } from '../../users/service/userService';
import { CommentsService } from '../../comments/service/commentsService';
import { PostModel, NewestLikes } from '../database/entity/postEntities';
import { PostLikeService } from '../../post-likes/postLikeService';

import { DeviceService } from '../../device/service/deviceService';
@injectable()
export class PostService {
  constructor(
    @inject(PostRepositoryImpl) readonly postRepository: PostRepositoryImpl,
    @inject(LikeCommentService) readonly likeCommentService: LikeCommentService,
    @inject(PostLikeService) readonly postLikeService: PostLikeService,
    @inject(UsersService) readonly usersService: UsersService,
    @inject(CommentsService) readonly commentsService: CommentsService,
    @inject(DeviceService) readonly deviceService: DeviceService
  ) {}

  async createPost(dto: InputPostDto, blogName: string): Promise<Result<string | null>> {
    const newPost = PostModel.createPost(dto, blogName);
    await this.postRepository.save(newPost);

    return createResult('CREATED', newPost.id);
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<Result<boolean>> {
    const post = await this.postRepository.getPostById(id);
    if (!post) return createResult('NOT_FOUND', false);

    post.updatePost(dto);
    await this.postRepository.save(post);

    return createResult('NO_CONTENT', true);
  }

  async deletePost(id: string): Promise<Result<boolean>> {
    const resultDelete = await this.postRepository.delete(id);
    if (!resultDelete) return createResult('NOT_FOUND', resultDelete);

    return createResult('NO_CONTENT', resultDelete);
  }

  async createCommentByPostId(
    postId: string,
    content: string,
    userId: string
  ): Promise<Result<string | null>> {
    const post = await this.postRepository.getPostById(postId);
    if (!post || !userId) return createResult('NOT_FOUND', null);

    const user = await this.usersService.getUserById(userId);
    if (!user) return createResult('NOT_FOUND', null);

    const commentId = await this.commentsService.createCommentByPostId(postId, content, user);
    return createResult('CREATED', commentId.data);
  }

  async getStatusesForPostsByUserId(
    userId: string,
    blogId?: string
  ): Promise<Map<string, string> | null> {
    const query = blogId ? { userId, blogId } : { userId };
    const likes = await this.postLikeService.getStatuses(query);

    if (likes.length === 0) return null;

    return new Map(likes.map(like => [like.postId, like.status]));
  }

  async getNewestStatusesForPosts(
    blogId?: string
  ): Promise<{ [postId: string]: NewestLikes[] } | null> {
    let postsIds: string[] = [];
    if (blogId) {
      const posts = await this.postRepository.getPostsByBlogId(blogId);
      postsIds = posts.map(post => post.id);
    }

    const newestLikes = await this.postLikeService.getNewestStatusesForPosts(postsIds);
    if (newestLikes.length === 0) return null;
    const result: { [postId: string]: NewestLikes[] } = {};
    newestLikes.forEach(like => {
      if (!result[like.postId]) {
        result[like.postId] = [];
      }
      if (result[like.postId].length < 3) {
        result[like.postId].push({
          userId: like.userId,
          login: like.login,
          addedAt: like.createdAt,
        });
      }
    });
    return result;
  }

  async getStatusesForPost(
    postId: string,
    userId: string
  ): Promise<{ [postId: string]: string } | null> {
    const statuses = await this.postLikeService.getStatusesForPost(postId, userId);
    return statuses;
  }

  async getNewestLikesForPost(
    postId: string
  ): Promise<{ userId: string; login: string; addedAt: Date }[] | []> {
    const newestLikes = await this.postLikeService.getNewestLikesForPost(postId);
    return newestLikes;
  }

  async updateLikeStatusPost(
    postId: string,
    likeStatus: string,
    userId: string
  ): Promise<Result<boolean>> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) return createResult('NOT_FOUND', false);

    const user = await this.usersService.getUserById(userId);
    const countStatus = await this.postLikeService.manageLike(postId, likeStatus, user!);

    if (!countStatus) {
      return createResult('NO_CONTENT', true);
    }
    post.updateExtendedLikesInfo(countStatus);
    await this.postRepository.save(post);

    return createResult('NO_CONTENT', true);
  }
}
