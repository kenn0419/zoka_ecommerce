interface IPaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

interface IPaginationQueries {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}
