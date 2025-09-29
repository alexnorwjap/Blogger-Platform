import { Request } from 'express';

type RequestBody<T> = Request<{}, {}, T>;
type RequestQuery<T> = Request<{}, {}, {}, T>;
type RequestParams<T> = Request<T>;
type RequestParamsAndBody<T, B> = Request<T, {}, B, {}>;
type RequestParamsAndQuery<T, Q> = Request<T, {}, {}, Q>;

export { RequestBody, RequestQuery, RequestParams, RequestParamsAndBody, RequestParamsAndQuery };
