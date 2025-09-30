import { Response } from 'express';
import { UsersViewModel } from '../../../models/UsersViewModel';
import { RequestQuery } from '../../../../../shared/types/api.types';
import { queryParamsDto } from '../../../repositories/dto/queryParamsDto';
import { usersQueryRepository } from '../../../infrastructure/db/repositories/UsersQueryRepoImpl';
import { HTTP_STATUS_CODES } from '../../../../../shared/constants/http-status';

export const getUsersList = async (req: RequestQuery<queryParamsDto>, res: Response<UsersViewModel>) => {
  const users = await usersQueryRepository.getAll(req.query);
  res.status(HTTP_STATUS_CODES.OK_200).send(users);
};
