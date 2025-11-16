import { CommentsRepositoryImpl } from '../database/commentsRepoImpl';
import { UserViewModel } from '../../users/models/User';
import { createResult, Result } from '../../../shared/utils/result-object';
import { inject, injectable } from 'inversify';

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepositoryImpl) readonly commentsRepository: CommentsRepositoryImpl
  ) {}

  async updateComment(id: string, content: string): Promise<Result<boolean>> {
    const resultUpdate = await this.commentsRepository.updateComment(id, content);
    if (!resultUpdate) return createResult('NOT_FOUND', resultUpdate);

    return createResult('NO_CONTENT', resultUpdate);
  }

  async deleteComment(id: string): Promise<Result<boolean>> {
    const resultDelete = await this.commentsRepository.deleteComment(id);
    if (!resultDelete) return createResult('NOT_FOUND', resultDelete);

    return createResult('NO_CONTENT', resultDelete);
  }

  async createCommentByPostId(
    postId: string,
    content: string,
    user: UserViewModel
  ): Promise<Result<string | null>> {
    const comment = {
      postId,
      content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
      createdAt: new Date(),
    };
    const result = await this.commentsRepository.createCommentByPostId(comment);
    if (!result) return createResult('BAD_REQUEST', result);

    return createResult('CREATED', result);
  }
}
