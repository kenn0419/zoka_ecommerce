import type { ICategoryResponse } from "../types/category.type";
import type { IPaginatedResponse } from "../types/pagination.type";
import { categoryApi } from "../apis/category.api";
import { create } from "zustand";

interface CategoryState {
  categories: ICategoryResponse[];
  meta: IPaginatedResponse<ICategoryResponse>["meta"] | null;
  loading: boolean;
  fetchCategories: (
    page?: number,
    limit?: number,
    search?: string,
    sort?: string
  ) => Promise<void>;
}

export const categoryStore = create<CategoryState>()((set) => ({
  categories: [],
  meta: null,
  loading: false,
  fetchCategories: async (page = 1, limit = 20, search?, sort?) => {
    set({ loading: true });
    try {
      const response = await categoryApi.fetchCategories({
        page,
        limit,
        search,
        sort,
      });
      const { items, meta } = response.data;
      set({ categories: items, meta });
    } finally {
      set({ loading: false });
    }
  },
}));
