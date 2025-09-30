import { HTTP_STATUS_CODES } from '../../../../../shared/constants/http-status';
import { RequestParams } from '../../../../../shared/types/api.types';
import { userService } from '../../../service/userService';
import { Response } from 'express';

export const deleteUser = async (req: RequestParams<{ id: string }>, res: Response) => {
  const result = await userService.deleteUser(req.params.id);
  res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
};
