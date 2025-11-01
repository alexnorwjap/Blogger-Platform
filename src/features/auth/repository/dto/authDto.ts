type AuthDto = {
  loginOrEmail: string;
  password: string;
};

type DeviceDto = {
  deviceId: string;
  date: Date;
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

export { AuthDto, InputRegistrationDto, InputConfirmationDto, DeviceDto };
