export class UserViewModel {
  constructor(
    readonly id: string,
    readonly login: string,
    readonly email: string,
    readonly createdAt: Date
  ) {}
}
