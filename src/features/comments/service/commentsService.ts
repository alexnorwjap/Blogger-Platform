import { CommandCommentsRepository } from '../repository/commandRepo';
import { CommentsCommandRepoImpl } from '../database/commandRepoImpl';
import { UserViewModel } from '../../users/models/User';
import { createResult, Result } from '../../../shared/utils/result-object';

class CommentsService {
  constructor(readonly commentsCommandRepo: CommandCommentsRepository) {}

  async updateComment(id: string, content: string): Promise<Result<boolean>> {
    const resultUpdate = await this.commentsCommandRepo.updateComment(id, content);
    if (!resultUpdate) {
      return createResult('NOT_FOUND', resultUpdate);
    }
    return createResult('NO_CONTENT', resultUpdate);
  }
  async deleteComment(id: string): Promise<Result<boolean>> {
    const resultDelete = await this.commentsCommandRepo.deleteComment(id);
    if (!resultDelete) {
      return createResult('NOT_FOUND', resultDelete);
    }
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
    const result = await this.commentsCommandRepo.createCommentByPostId(comment);
    if (!result) {
      return createResult('BAD_REQUEST', null, 'Comment not created');
    }
    return createResult('CREATED', result);
  }
}

export const commentsService = new CommentsService(new CommentsCommandRepoImpl());
