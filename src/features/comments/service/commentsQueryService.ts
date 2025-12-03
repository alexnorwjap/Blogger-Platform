import { CommentQueryMapper } from '../database/commentQueryMapper';
import { CommentsQueryRepoImpl } from '../database/commentsQueryRepoImpl';
import { CommentsViewModel, CommentViewModel } from '../model/commentViewModel';
import { inject, injectable } from 'inversify';
import { LikeCommentService } from '../../comment-likes/likeService';
import { queryParamsDto } from '../repository/repositoryDto';
import { createResult, Result } from '../../../shared/utils/result-object';

@injectable()
export class CommentsQueryService {
  constructor(
    @inject(CommentsQueryRepoImpl) readonly commentsQueryRepo: CommentsQueryRepoImpl,
    @inject(LikeCommentService) readonly LikeCommentService: LikeCommentService
  ) {}

  async getCommentByIdWithStatus(
    id: string,
    userId: string | null
  ): Promise<CommentViewModel | null> {
    let status: string | null = null;
    if (userId) {
      status = await this.LikeCommentService.getStatusByUserAndCommentId(userId, id);
    }

    const comment = await this.commentsQueryRepo.getCommentById(id);
    if (!comment) return null;
    return CommentQueryMapper.toDomain(comment, status);
  }

  async getCommentsAndStatusesByPostId(
    userId: string | null,
    query: queryParamsDto,
    postId: string
  ): Promise<Result<CommentsViewModel>> {
    const queryResult = CommentQueryMapper.toFilterSortPagination(query);
    const { comments, count } = await this.commentsQueryRepo.getCommentsByPostId(
      postId,
      queryResult
    );
    if (count === 0) {
      return createResult('SUCCESS', {
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [],
      });
    }
    let statuses: Map<string, string> | null = null;
    const idsComments = comments.map(comment => comment.id);
    if (userId) {
      statuses = await this.LikeCommentService.getStatusesByUserAndCommentIds(userId, idsComments);
    }

    const commentsWithStatus = comments.map(comment =>
      CommentQueryMapper.toDomain(comment, statuses?.get(comment.id))
    );

    const commentsViewModel = CommentQueryMapper.toDomainViewModel(
      query,
      count,
      commentsWithStatus
    );

    return createResult('SUCCESS', commentsViewModel);
  }
}
