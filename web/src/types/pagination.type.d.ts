export interface IPaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface IPaginationQueries {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}
