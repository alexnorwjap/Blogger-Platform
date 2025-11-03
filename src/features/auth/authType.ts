type AuthViewModel = {
  userId: string;
  login: string;
  email: string;
};

type LoginRequestInfo = {
  ip: string;
  title: string;
};

type DeviceIdType = {
  deviceId: string;
  date: string;
};

type TokensType = {
  accessToken: string;
  refreshToken: string;
};

export { AuthViewModel, DeviceIdType, TokensType, LoginRequestInfo };
