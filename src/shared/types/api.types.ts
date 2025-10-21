import { Request } from 'express';
import { ObjectId } from 'mongodb';

type RequestBody<T> = Request<unknown, unknown, T>;
type RequestQuery<T> = Request<unknown, unknown, unknown, T>;
type RequestParams<T> = Request<T>;
type RequestParamsAndBody<T, B> = Request<T, unknown, B, unknown>;
type RequestParamsAndQuery<T, Q> = Request<T, unknown, unknown, Q>;
type CustomRequest = Request<unknown, unknown, unknown, unknown>;
type UserRequest = CustomRequest & { user?: ObjectId };
type DeviceRequest = CustomRequest & { deviceId?: string };

type AuthRequestParamsAndBody<T, B> = Request<T, unknown, B, unknown> & { user?: ObjectId };
type AuthRequestParams<T> = Request<T, unknown, unknown, unknown> & { user?: ObjectId };

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
};
