import { CommandCommentsRepository } from '../repository/commandRepo';
import { CommentsCommandRepoImpl } from '../database/commandRepoImpl';

class CommentsService {
  constructor(readonly commentsCommandRepo: CommandCommentsRepository) {}

  async updateComment(id: string, content: string): Promise<boolean> {
    return await this.commentsCommandRepo.updateComment(id, content);
  }
  async deleteComment(id: string): Promise<boolean> {
    return await this.commentsCommandRepo.deleteComment(id);
  }
  async createCommentByPostId(
    postId: string,
    content: string,
    userInfo: { userId: string; userLogin: string }
  ): Promise<string> {
    const comment = {
      postId,
      content,
      commentatorInfo: userInfo,
      createdAt: new Date(),
    };
    return await this.commentsCommandRepo.createCommentByPostId(comment);
  }
}

export const commentsService = new CommentsService(new CommentsCommandRepoImpl());
