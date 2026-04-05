import instance from "./axios-customize";

export const categoryApi = {
  fetchAdminCategories: async ({
    page = 1,
    limit = 12,
    search,
    sort = "createdAt_desc",
  }: IPaginationQueries): Promise<
    IApiResponse<IPaginatedResponse<ICategoryResponse>>
  > => {
    return await instance.get("/category", {
      params: { page, limit, search, sort },
    });
  },

  fetchActiveCategories: async ({
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

  createCategory: async (
    data: ICategoryCreationRequest
  ): Promise<IApiResponse<ICategoryResponse>> => {
    return await instance.post("/category", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateCategory: async (
    slug: string,
    data: ICategoryUpdateRequest
  ): Promise<IApiResponse<ICategoryResponse>> => {
    return await instance.patch(`/category/${slug}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  activateCategory: async (
    slug: string
  ): Promise<IApiResponse<ICategoryResponse>> => {
    return await instance.patch(`/category/${slug}/activate`);
  },

  deactivateCategory: async (
    slug: string
  ): Promise<IApiResponse<ICategoryResponse>> => {
    return await instance.patch(`/category/${slug}/deactivate`);
  },

  deleteCategory: async (slug: string): Promise<IApiResponse<null>> => {
    return await instance.delete(`/category/${slug}`);
  },
};
