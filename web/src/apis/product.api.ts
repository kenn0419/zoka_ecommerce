import type {
  IPaginatedResponse,
  IPaginationQueries,
} from "../types/pagination.type";
import type {
  IProductDetailResponse,
  IProductListItemResponse,
} from "../types/product.type";
import instance from "./axios-customize";

export const productApi = {
  fetchActiveProducts: async ({
    page = 1,
    limit = 12,
    search,
    sort = "oldest",
  }: IPaginationQueries): Promise<
    IApiResponse<IPaginatedResponse<IProductListItemResponse>>
  > => {
    return await instance.get("/product/active", {
      params: { page, limit, search, sort },
    });
  },

  fetchProductsByCategory: async ({
    categorySlug,
    page = 1,
    limit = 12,
    search,
    sort = "oldest",
  }: IPaginationQueries & { categorySlug: string }): Promise<
    IApiResponse<IPaginatedResponse<IProductListItemResponse>>
  > => {
    return await instance.get(`/product/category/${categorySlug}`, {
      params: { page, limit, search, sort },
    });
  },

  fetchProductDetail: async (
    productSlug: string
  ): Promise<IApiResponse<IProductDetailResponse>> => {
    return await instance.get(`/product/detail/${productSlug}`);
  },
};
