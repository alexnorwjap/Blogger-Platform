export class User {
  constructor(
    readonly id: string,
    readonly login: string,
    readonly email: string,
    readonly password: string,
    readonly createdAt: Date
  ) {}
}

export class UserViewModel {
  constructor(
    readonly id: string,
    readonly login: string,
    readonly email: string,
    readonly createdAt: Date
  ) {}
}
