import { UserViewModel } from './User';

export class UsersViewModel {
  constructor(
    readonly pagesCount: number,
    readonly page: number,
    readonly pageSize: number,
    readonly totalCount: number,
    readonly items: UserViewModel[]
  ) {}
}
