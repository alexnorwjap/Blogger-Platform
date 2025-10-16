import { HTTP_STATUS_CODES } from '../../../../../shared/constants/http-status';
import { RequestParams } from '../../../../../shared/types/api.types';
import { userService } from '../../../service/userService';
import { Response } from 'express';
import { validationResult } from 'express-validator';

export const deleteUser = async (req: RequestParams<{ id: string }>, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }

  const result = await userService.deleteUser(req.params.id);
  if (!result) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND404);
    return;
  }
  res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
};
