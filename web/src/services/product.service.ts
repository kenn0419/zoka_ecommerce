import { productApi } from "../apis/product.api";
import type {
  IPaginatedResponse,
  IPaginationQueries,
} from "../types/pagination.type";
import type {
  IProductDetailResponse,
  IProductListItemResponse,
} from "../types/product.type";

export const productService = {
  async fetchActiveProducts(
    params: IPaginationQueries = {}
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const { page = 1, limit = 12, search, sort = "oldest" } = params;

    const res = await productApi.fetchActiveProducts({
      page,
      limit,
      search,
      sort,
    });

    return res.data;
  },

  async fetchProductsByCategory(
    categorySlug: string,
    params: IPaginationQueries
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const res = await productApi.fetchProductsByCategory({
      categorySlug,
      ...params,
    });

    return res.data;
  },

  async fetchProductDetail(
    productSlug: string
  ): Promise<IProductDetailResponse> {
    const res = await productApi.fetchProductDetail(productSlug);
    return res.data;
  },

  async fetchRelatedProducts(
    categorySlug: string
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const res = await productApi.fetchProductsByCategory({
      categorySlug,
      page: 1,
      limit: 6,
    });

    return res.data;
  },

  async suggestProducts(
    keyword: string
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const res = await productApi.fetchSuggestProducts(keyword);
    return res.data;
  },
};
