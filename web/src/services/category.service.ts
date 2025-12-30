import { categoryApi } from "../apis/category.api";
import type { ICategoryResponse } from "../types/category.type";
import type { IPaginatedResponse } from "../types/pagination.type";

export const categoryService = {
  getActiveCategories: async ({
    page = 1,
    limit = 20,
    search,
    sort,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }): Promise<IPaginatedResponse<ICategoryResponse>> => {
    const res = await categoryApi.fetchActiveCategories({
      page,
      limit,
      search,
      sort,
    });

    return res.data;
  },
};
