import type {
  IPaginatedResponse,
  IPaginationQueries,
} from "../types/pagination.type";
import type { IProductResponse } from "../types/product.type";
import instance from "./axios-customize";

export const productApi = {
  fetchActiveProducts: async ({
    page = 1,
    limit = 12,
    search,
    sort = "createdAt_desc",
  }: IPaginationQueries): Promise<
    IApiResponse<IPaginatedResponse<IProductResponse>>
  > => {
    return await instance.get("/product/active", {
      params: { page, limit, search, sort },
    });
  },
};
