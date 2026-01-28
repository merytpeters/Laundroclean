import type { RequestHandler, Request, Response, NextFunction } from 'express';
import type { APIResponse } from '../types/index.js';

export interface CustomParamsDictionary {
  [key: string]: any
};

export interface PaginationQuery {
  page?: string
  limit?: string
  search?: string
};

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
    Promise.resolve(callback(req, res, next)).catch((err) => next(err));
  };

export default asyncHandler;
