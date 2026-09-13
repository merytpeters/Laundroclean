export interface PaginationParamQuery {
    page?: number;
    limit?: number;
    search?: string;
}

export interface ByActiveParam extends PaginationParamQuery {
  isActive?: 'true' | 'false';
}