import type { ICategoryResponse } from "../types/category.type";
import type {
  IPaginatedResponse,
  IPaginationQueries,
} from "../types/pagination.type";
import instance from "./axios-customize";

export const categoryApi = {
  fetchCategories: async ({
    page = 1,
    limit = 12,
    search,
    sort = "createdAt_desc",
  }: IPaginationQueries): Promise<
    IApiResponse<IPaginatedResponse<ICategoryResponse>>
  > => {
    return await instance.get("/category/active", {
      params: { page, limit, search, sort },
    });
  },
};
