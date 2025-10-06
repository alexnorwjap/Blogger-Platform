import { HTTP_STATUS_CODES } from '../../../../../shared/constants/http-status';
import { RequestBody } from '../../../../../shared/types/api.types';
import { UserViewModel } from '../../../models/User';
import { CreateUserDto } from '../../../service/userServiceDto';
import { userService } from '../../../service/userService';
import { Response } from 'express';
import { WrapValidErrorsType } from '../../../../../shared/types/errors-type';

export const createUser = async (
  req: RequestBody<CreateUserDto>,
  res: Response<UserViewModel | WrapValidErrorsType>
) => {
  const newUser = await userService.createUser(req.body);
  if ('errorsMessages' in newUser) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST400).send(newUser);
    return;
  }
  res.status(HTTP_STATUS_CODES.CREATED_201).send(newUser);
};
