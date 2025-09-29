import { RequestParams } from '../../../shared/types/api.types';
import { PostId } from '../posts.dto';
import { Response } from 'express';
import { validationResult } from 'express-validator';
import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { postService } from '../postService';

export const updatePost = async (req: RequestParams<PostId>, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST400);
    return;
  }
  const result = await postService.updatePost(req.params.id, req.body);
  if (!result) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
};
