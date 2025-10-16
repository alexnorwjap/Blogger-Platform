type AuthDto = {
  loginOrEmail: string;
  password: string;
};

type AuthViewModel = {
  userId: string;
  login: string;
  email: string;
};

type InputRegistrationDto = {
  login: string;
  password: string;
  email: string;
};

type InputConfirmationDto = {
  isConfirmed: boolean;
  confirmation: {
    confirmationCode: string;
    expirationDate: Date;
  };
};

export { AuthDto, AuthViewModel, InputRegistrationDto, InputConfirmationDto };
