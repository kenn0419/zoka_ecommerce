import { categoryApi } from "../apis/category.api";

export const categoryService = {
  getAdminCategories: async ({
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
    const res = await categoryApi.fetchAdminCategories({
      page,
      limit,
      search,
      sort,
    });

    return res.data;
  },

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

  createCategory: async (data: ICategoryCreationRequest): Promise<ICategoryResponse> => {
    const res = await categoryApi.createCategory(data);
    return res.data;
  },

  updateCategory: async (slug: string, data: ICategoryUpdateRequest): Promise<ICategoryResponse> => {
    const res = await categoryApi.updateCategory(slug, data);
    return res.data;
  },

  activateCategory: async (slug: string): Promise<ICategoryResponse> => {
    const res = await categoryApi.activateCategory(slug);
    return res.data;
  },

  deactivateCategory: async (slug: string): Promise<ICategoryResponse> => {
    const res = await categoryApi.deactivateCategory(slug);
    return res.data;
  },

  deleteCategory: async (slug: string): Promise<null> => {
    const res = await categoryApi.deleteCategory(slug);
    return res.data;
  },
};
