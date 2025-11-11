export class authModel {
  constructor(
    readonly email: string,
    readonly login: string,
    readonly userId: string,
    readonly password: string,
    readonly createdAt: Date,
    readonly isConfirmed: boolean,
    readonly confirmation: {
      confirmationCode: string;
      expirationDate: Date;
    },
    readonly recoveryCode: string,
    readonly recoveryCodeExpirationDate: Date
  ) {}
}
