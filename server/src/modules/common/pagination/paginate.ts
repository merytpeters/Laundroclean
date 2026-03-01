import type { PaginationQuery } from '../../../utils/asyncHandler.js';

export const getPagination = (query: PaginationQuery) => {
  const page = Math.max(parseInt(String(query.page || '1')), 1);
  const limit = Math.max(parseInt(String(query.limit || '10')), 1);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
