import { Request } from 'express';

type RequestBody<T> = Request<unknown, unknown, T>;
type RequestQuery<T> = Request<unknown, unknown, unknown, T>;
type RequestParams<T> = Request<T>;
type RequestParamsAndBody<T, B> = Request<T, unknown, B, unknown>;
type RequestParamsAndQuery<T, Q> = Request<T, unknown, unknown, Q>;
type CustomRequest = Request<unknown, unknown, unknown, unknown>;

export { RequestBody, RequestQuery, RequestParams, RequestParamsAndBody, RequestParamsAndQuery, CustomRequest };
