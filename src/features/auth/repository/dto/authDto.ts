type AuthDto = {
  loginOrEmail: string;
  password: string;
};

type AuthViewModel = {
  userId: string;
  login: string;
  email: string;
};

export { AuthDto, AuthViewModel };
