import type { RequestHandler, Request, Response, NextFunction } from 'express';
import type { APIResponse } from '../types/index.js';

export interface CustomParamsDictionary {
  [key: string]: any
};

export interface PaginationQuery {
  page?: number
  limit?: number
  search?: string
};

export interface UserQuery extends PaginationQuery {
  status?: 'active' | 'inactive';
  type?: 'client' | 'company';
}


const asyncHandler =
  <T = any>(
    callback: RequestHandler<
      CustomParamsDictionary,
      APIResponse<T>,
      any,
      PaginationQuery,
      Record<string, any>
    >
  ) =>
  (req: Request, res: Response<APIResponse<T>>, next: NextFunction) => {
    return Promise.resolve(callback(req, res, next)).catch((err) => next(err));
  };

export default asyncHandler;
