import instance from "./axios-customize";

export const productApi = {
  fetchActiveProducts: async ({
    page = 1,
    limit = 12,
    search,
    sort = "oldest",
    minPrice,
    maxPrice,
    rating,
  }: IProductFilterQueries): Promise<
    IApiResponse<IPaginatedResponse<IProductListItemResponse>>
  > => {
    return await instance.get(`/products/active`, {
      params: { page, limit, search, sort, minPrice, maxPrice, rating },
    });
  },

  fetchProductsByCategory: async ({
    categorySlug,
    page = 1,
    limit = 12,
    search,
    sort = "oldest",
    minPrice,
    maxPrice,
    rating,
  }: IProductFilterQueries & { categorySlug: string }): Promise<
    IApiResponse<IPaginatedResponse<IProductListItemResponse>>
  > => {
    return await instance.get(`/products/category/${categorySlug}`, {
      params: { page, limit, search, sort, minPrice, maxPrice, rating },
    });
  },

  fetchProductDetailBySlug: async (
    productSlug: string,
  ): Promise<IApiResponse<IProductDetailResponse>> => {
    return await instance.get(`/products/public/detail/${productSlug}`);
  },

  fetchProductDetailById: async (
    productSlug: string,
  ): Promise<IApiResponse<IProductDetailResponse>> => {
    return await instance.get(`/products/internal/detail/${productSlug}`);
  },

  fetchSuggestProducts: async (
    search: string,
  ): Promise<IApiResponse<IPaginatedResponse<IProductListItemResponse>>> => {
    return await instance.get(`/products/suggest`, { params: { search } });
  },

  fetchProductsByShop: async ({
    shopId,
    page = 1,
    limit = 12,
    search,
    sort = "oldest",
  }: IProductFilterQueries & { shopId: string }) => {
    return await instance.get(`/products/shop/${shopId}`, {
      params: { page, limit, search, sort },
    });
  },

  fetchActiveShopProducts: async ({
    shopSlug,
    page = 1,
    limit = 12,
    search,
    sort = "oldest",
  }: IProductFilterQueries & { shopSlug: string }) => {
    return await instance.get(`/products/active/shop/${shopSlug}`, {
      params: { page, limit, search, sort },
    });
  },

  createProduct: async (
    data: FormData,
  ): Promise<IApiResponse<IProductListItemResponse>> => {
    return await instance.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
