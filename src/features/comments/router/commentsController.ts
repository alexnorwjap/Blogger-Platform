import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { Response } from 'express';
import { CommentsService } from '../service/commentsService';
import { AuthRequestParams, AuthRequestParamsAndBody } from '../../../shared/types/api.types';
import { inject, injectable } from 'inversify';
import { CommentsQueryService } from '../service/commentsQueryService';
@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsQueryService) readonly commentsQueryService: CommentsQueryService,
    @inject(CommentsService) readonly commentsService: CommentsService
  ) {}
  getCommentById = async (req: AuthRequestParams<{ id: string }>, res: Response) => {
    const comment = await this.commentsQueryService.getCommentByIdWithStatus(
      req.params.id,
      req.user || null
    );
    if (!comment) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    res.status(HTTP_STATUS_CODES.SUCCESS).send(comment);
  };
  updateComment = async (
    req: AuthRequestParamsAndBody<{ id: string }, { content: string }>,
    res: Response
  ) => {
    if (!req.user) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    const resultUpdate = await this.commentsService.updateComment(
      req.params.id,
      req.body.content,
      req.user
    );
    if (!resultUpdate.data) return res.sendStatus(HTTP_STATUS_CODES[resultUpdate.status]);

    res.sendStatus(HTTP_STATUS_CODES[resultUpdate.status]);
  };

  deleteComment = async (req: AuthRequestParams<{ id: string }>, res: Response) => {
    if (!req.user) return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);

    const resultDelete = await this.commentsService.deleteComment(req.params.id, req.user);
    if (!resultDelete.data) return res.sendStatus(HTTP_STATUS_CODES[resultDelete.status]);

    res.sendStatus(HTTP_STATUS_CODES[resultDelete.status]);
  };

  changeLikeStatus = async (
    req: AuthRequestParamsAndBody<{ id: string }, { likeStatus: string }>,
    res: Response
  ) => {
    const resultManageLike = await this.commentsService.changeLikeStatus(
      req.params.id,
      req.user!,
      req.body.likeStatus
    );

    if (!resultManageLike.data) {
      return res.sendStatus(HTTP_STATUS_CODES[resultManageLike.status]);
    }

    res.sendStatus(HTTP_STATUS_CODES[resultManageLike.status]);
  };
}
