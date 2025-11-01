import { Request } from 'express';
import { DeviceIdType } from '../../features/auth/authType';
import { authModel } from '../../features/auth/model/authModel';

type RequestBody<T> = Request<unknown, unknown, T>;
type RequestQuery<T> = Request<unknown, unknown, unknown, T>;
type RequestParams<T> = Request<T>;
type RequestParamsAndBody<T, B> = Request<T, unknown, B, unknown>;
type RequestParamsAndQuery<T, Q> = Request<T, unknown, unknown, Q>;
type CustomRequest = Request<unknown, unknown, unknown, unknown>;
type UserRequest = CustomRequest & { user?: string };
type DeviceRequest = CustomRequest & { deviceId?: string };
type RefreshTokenRequest = CustomRequest & { user?: authModel; device?: DeviceIdType };

type AuthRequestParamsAndBody<T, B> = Request<T, unknown, B, unknown> & { user?: string };
type AuthRequestParams<T> = Request<T, unknown, unknown, unknown> & { user?: string };

export {
  UserRequest,
  RequestBody,
  RequestQuery,
  RequestParams,
  RequestParamsAndBody,
  RequestParamsAndQuery,
  CustomRequest,
  AuthRequestParamsAndBody,
  AuthRequestParams,
  DeviceRequest,
  RefreshTokenRequest,
};
