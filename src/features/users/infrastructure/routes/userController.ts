import { HTTP_STATUS_CODES } from '../../../../shared/constants/http-status';
import { RequestBody, RequestParams } from '../../../../shared/types/api.types';
import { UserViewModel } from '../../models/User';
import { CreateUserDto } from '../../service/userServiceDto';
import { UsersService } from '../../service/userService';
import { WrapValidErrorsType } from '../../../../shared/types/errors-type';
import { Response } from 'express';
import { UsersQueryRepoImpl } from '../../infrastructure/db/repositories/UsersQueryRepoImpl';
import { queryParamsDto } from '../../repositories/dto/queryParamsDto';
import { UsersViewModel } from '../../models/UsersViewModel';
import { RequestQuery } from '../../../../shared/types/api.types';
import { inject, injectable } from 'inversify';

@injectable()
export class UsersController {
  constructor(
    @inject(UsersQueryRepoImpl) readonly usersQueryRepository: UsersQueryRepoImpl,
    @inject(UsersService) readonly usersService: UsersService
  ) {}

  getUsersList = async (req: RequestQuery<queryParamsDto>, res: Response<UsersViewModel>) => {
    const users = await this.usersQueryRepository.getAll(req.query);
    if (users.items.length === 0)
      return res.status(HTTP_STATUS_CODES.SUCCESS).send({
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [],
      });
    return res.status(HTTP_STATUS_CODES.SUCCESS).send(users);
  };

  createUser = async (
    req: RequestBody<CreateUserDto>,
    res: Response<UserViewModel | WrapValidErrorsType>
  ) => {
    const existingUser = await this.usersQueryRepository.findByLoginOrEmail(
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

    const newUserId = await this.usersService.createUser(req.body);
    if (!newUserId.data) return res.status(HTTP_STATUS_CODES[newUserId.status]);

    const newUser = await this.usersQueryRepository.getUserById(newUserId.data);
    if (!newUser) return res.status(HTTP_STATUS_CODES.BAD_REQUEST);

    res.status(HTTP_STATUS_CODES.CREATED).send(newUser);
  };

  deleteUser = async (req: RequestParams<{ id: string }>, res: Response) => {
    const resultDelete = await this.usersService.deleteUser(req.params.id);

    if (!resultDelete.data) return res.sendStatus(HTTP_STATUS_CODES[resultDelete.status]);
    res.sendStatus(HTTP_STATUS_CODES[resultDelete.status]);
  };
}
