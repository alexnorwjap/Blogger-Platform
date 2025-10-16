export type User = {
  login: string;
  email: string;
  password: string;
  createdAt: Date;
  isConfirmed: boolean;
  confirmation: {
    confirmationCode: string;
    expirationDate: Date;
  };
};
