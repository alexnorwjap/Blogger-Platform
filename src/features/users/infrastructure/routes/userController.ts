import { HTTP_STATUS_CODES } from '../../../../shared/constants/http-status';
import { RequestBody, RequestParams } from '../../../../shared/types/api.types';
import { UserViewModel } from '../../models/User';
import { CreateUserDto } from '../../service/userServiceDto';
import { userService } from '../../service/userService';
import { WrapValidErrorsType } from '../../../../shared/types/errors-type';
import { Response } from 'express';
import { usersQueryRepository } from '../../infrastructure/db/repositories/UsersQueryRepoImpl';
import { queryParamsDto } from '../../repositories/dto/queryParamsDto';
import { UsersViewModel } from '../../models/UsersViewModel';
import { RequestQuery } from '../../../../shared/types/api.types';

class UserController {
  async getUsersList(req: RequestQuery<queryParamsDto>, res: Response<UsersViewModel>) {
    const users = await usersQueryRepository.getAll(req.query);
    if (users.items.length === 0)
      return res.status(HTTP_STATUS_CODES.SUCCESS).send({
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [],
      });
    return res.status(HTTP_STATUS_CODES.SUCCESS).send(users);
  }

  async createUser(
    req: RequestBody<CreateUserDto>,
    res: Response<UserViewModel | WrapValidErrorsType>
  ) {
    const existingUser = await usersQueryRepository.findByLoginOrEmail(
      req.body.login,
      req.body.email
    );
    if (existingUser) {
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
        errorsMessages: [
          {
            field: existingUser.login === req.body.login ? 'login' : 'email',
            message: `User with this ${existingUser.login === req.body.login ? 'login' : 'email'} already exists`,
          },
        ],
      });
    }
    const newUserId = await userService.createUser(req.body);
    if (!newUserId.data) return res.status(HTTP_STATUS_CODES[newUserId.status]);
    const newUser = await usersQueryRepository.getUserById(newUserId.data);
    if (!newUser) return res.status(HTTP_STATUS_CODES.BAD_REQUEST);
    res.status(HTTP_STATUS_CODES.CREATED).send(newUser);
  }

  async deleteUser(req: RequestParams<{ id: string }>, res: Response) {
    const resultDelete = await userService.deleteUser(req.params.id);

    if (!resultDelete.data) return res.sendStatus(HTTP_STATUS_CODES[resultDelete.status]);
    res.sendStatus(HTTP_STATUS_CODES[resultDelete.status]);
  }
}

export const userController = new UserController();
