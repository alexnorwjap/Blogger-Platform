import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { Request, Response } from 'express';
import { CommentsQueryRepoImpl } from '../database/commentsQueryRepoImpl';
import { CommentsService } from '../service/commentsService';
import { AuthRequestParams, AuthRequestParamsAndBody } from '../../../shared/types/api.types';
import { inject, injectable } from 'inversify';

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsQueryRepoImpl) readonly commentsQueryRepo: CommentsQueryRepoImpl,
    @inject(CommentsService) readonly commentsService: CommentsService
  ) {}

  getCommentById = async (req: Request, res: Response) => {
    const comment = await this.commentsQueryRepo.getCommentById(req.params.id);
    if (!comment) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    res.status(HTTP_STATUS_CODES.SUCCESS).send(comment);
  };

  updateComment = async (
    req: AuthRequestParamsAndBody<{ id: string }, { content: string }>,
    res: Response
  ) => {
    const comment = await this.commentsQueryRepo.getCommentById(req.params.id);
    if (!comment || !req.user) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    const isUserComment = await this.commentsQueryRepo.getCommentByUserIdAndCommentId(
      req.params.id,
      req.user
    );
    if (!isUserComment) return res.sendStatus(HTTP_STATUS_CODES.FORBIDDEN);

    const resultUpdate = await this.commentsService.updateComment(req.params.id, req.body.content);
    if (!resultUpdate.data) return res.sendStatus(HTTP_STATUS_CODES[resultUpdate.status]);

    res.sendStatus(HTTP_STATUS_CODES[resultUpdate.status]);
  };

  deleteComment = async (req: AuthRequestParams<{ id: string }>, res: Response) => {
    const comment = await this.commentsQueryRepo.getCommentById(req.params.id);
    if (!comment || !req.user) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    const isUserComment = await this.commentsQueryRepo.getCommentByUserIdAndCommentId(
      req.params.id,
      req.user
    );
    if (!isUserComment) return res.sendStatus(HTTP_STATUS_CODES.FORBIDDEN);

    const resultDelete = await this.commentsService.deleteComment(req.params.id);
    if (!resultDelete.data) return res.sendStatus(HTTP_STATUS_CODES[resultDelete.status]);

    res.sendStatus(HTTP_STATUS_CODES[resultDelete.status]);
  };
}
