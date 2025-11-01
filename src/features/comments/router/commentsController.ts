import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { Request, Response } from 'express';
import { commentsQueryRepoImpl } from '../database/queryRepoImpl';
import { commentsService } from '../service/commentsService';
import { AuthRequestParams, AuthRequestParamsAndBody } from '../../../shared/types/api.types';
import { validationResult } from 'express-validator';

class CommentsController {
  async getCommentById(req: Request, res: Response) {
    const comment = await commentsQueryRepoImpl.getCommentById(req.params.id);
    if (!comment) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
    res.status(HTTP_STATUS_CODES.SUCCESS).send(comment);
  }

  async updateComment(
    req: AuthRequestParamsAndBody<{ id: string }, { content: string }>,
    res: Response
  ) {
    const comment = await commentsQueryRepoImpl.getCommentById(req.params.id);
    if (!comment || !req.user) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    const isUserComment = await commentsQueryRepoImpl.getCommentByUserIdAndCommentId(
      req.params.id,
      req.user
    );
    if (!isUserComment) return res.sendStatus(HTTP_STATUS_CODES.FORBIDDEN);

    const resultUpdate = await commentsService.updateComment(req.params.id, req.body.content);
    if (!resultUpdate.data) return res.sendStatus(HTTP_STATUS_CODES[resultUpdate.status]);
    res.sendStatus(HTTP_STATUS_CODES[resultUpdate.status]);
  }

  async deleteComment(req: AuthRequestParams<{ id: string }>, res: Response) {
    const comment = await commentsQueryRepoImpl.getCommentById(req.params.id);
    if (!comment || !req.user) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    const isUserComment = await commentsQueryRepoImpl.getCommentByUserIdAndCommentId(
      req.params.id,
      req.user
    );
    if (!isUserComment) return res.sendStatus(HTTP_STATUS_CODES.FORBIDDEN);

    const resultDelete = await commentsService.deleteComment(req.params.id);
    if (!resultDelete.data) return res.sendStatus(HTTP_STATUS_CODES[resultDelete.status]);
    res.sendStatus(HTTP_STATUS_CODES[resultDelete.status]);
  }
}

export const commentsController = new CommentsController();
