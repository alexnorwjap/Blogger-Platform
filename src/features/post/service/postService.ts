import { PostRepositoryImpl } from '../database/repositories/PostRepositoryImpl';
import { InputPostDto } from './serviceDto';
import { UpdatePostDto } from '../repositories/dto/postRepoDto';
import { createResult, Result } from '../../../shared/utils/result-object';
import { inject, injectable } from 'inversify';
import { LikeService } from '../../like/likeService';
import { UsersService } from '../../users/service/userService';
import { CommentsService } from '../../comments/service/commentsService';
import { PostModelEntity } from '../database/entity/postEntities';

@injectable()
export class PostService {
  constructor(
    @inject(PostRepositoryImpl) readonly postRepository: PostRepositoryImpl,
    @inject(LikeService) readonly likeService: LikeService,
    @inject(UsersService) readonly usersService: UsersService,
    @inject(CommentsService) readonly commentsService: CommentsService
  ) {}

  async createPost(dto: InputPostDto, blogName: string): Promise<Result<string | null>> {
    const newPost = new PostModelEntity({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blogName,
    });

    const postId = await this.postRepository.save(newPost);
    return createResult('CREATED', postId);
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<Result<boolean>> {
    const post = await this.postRepository.getPostById(id);
    if (!post) return createResult('NOT_FOUND', false);
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;

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

    const user = await this.usersService.getUserIdById(userId);
    if (!user) return createResult('NOT_FOUND', null);

    const commentId = await this.commentsService.createCommentByPostId(postId, content, user);
    // if (!commentId.data) return createResult('BAD_REQUEST', null);
    return createResult('CREATED', commentId.data);
  }

  async getStatusesByPostId(
    id: string,
    userId: string | null
  ): Promise<Result<{ postId: string; statusData: Map<string, string> | null } | null>> {
    const post = await this.postRepository.getPostById(id);
    if (!post) return createResult('NOT_FOUND', null);

    let statusData: Map<string, string> | null = null;
    if (userId) {
      statusData = await this.likeService.getLikesByPostId(post.id, userId);
    }
    return createResult('SUCCESS', { postId: post.id, statusData });
  }
}
