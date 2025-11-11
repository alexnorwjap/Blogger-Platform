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

type recoveryCodeDto = {
  recoveryCode: string;
  recoveryCodeExpirationDate: Date;
};

type passwordRecoveryDto = {
  password: string;
  recoveryCode: string;
  recoveryCodeExpirationDate: Date;
};

export {
  AuthDto,
  InputRegistrationDto,
  InputConfirmationDto,
  DeviceDto,
  recoveryCodeDto,
  passwordRecoveryDto,
};
