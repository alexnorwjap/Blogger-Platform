import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { Request, Response } from 'express';
import { commentsQueryRepoImpl } from '../database/queryRepoImpl';
import { commentsService } from '../service/commentsService';
import { AuthRequestParams, AuthRequestParamsAndBody } from '../../../shared/types/api.types';

class CommentsController {
  async getCommentById(req: Request, res: Response) {
    const comment = await commentsQueryRepoImpl.getCommentById(req.params.id);
    if (!comment) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    res.status(HTTP_STATUS_CODES.OK_200).send(comment);
  }

  async updateComment(req: AuthRequestParamsAndBody<{ id: string }, { content: string }>, res: Response) {
    const isUserComment = await commentsQueryRepoImpl.getCommentByUserIdAndCommentId(req.params.id, req.user!);
    if (!isUserComment) {
      res.sendStatus(HTTP_STATUS_CODES.FORBIDDEN403);
      return;
    }
    const result = await commentsService.updateComment(req.params.id, req.body.content);
    if (!result) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
  }

  async deleteComment(req: AuthRequestParams<{ id: string }>, res: Response) {
    const isUserComment = await commentsQueryRepoImpl.getCommentByUserIdAndCommentId(req.params.id, req.user!);
    if (!isUserComment) {
      res.sendStatus(HTTP_STATUS_CODES.FORBIDDEN403);
      return;
    }
    const result = await commentsService.deleteComment(req.params.id);
    if (!result) {
      res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
      return;
    }
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
  }
}

export const commentsController = new CommentsController();
