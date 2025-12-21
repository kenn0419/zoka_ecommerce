import { create } from "zustand";
import type { IPaginatedResponse } from "../types/pagination.type";
import { productApi } from "../apis/product.api";
import type { IProductResponse } from "../types/product.type";

interface ProductState {
  products: IProductResponse[];
  meta: IPaginatedResponse<IProductResponse>["meta"] | null;
  loading: boolean;
  fetchActiveProducts: (
    page?: number,
    limit?: number,
    search?: string,
    sort?: string
  ) => Promise<void>;
}

export const productStore = create<ProductState>()((set) => ({
  products: [],
  meta: null,
  loading: false,
  canVerify: false,

  fetchActiveProducts: async (page = 1, limit = 20, search?, sort?) => {
    set({ loading: true });
    try {
      const response = await productApi.fetchActiveProducts({
        page,
        limit,
        search,
        sort,
      });
      const { items, meta } = response.data;
      set({ products: items, meta });
    } finally {
      set({ loading: false });
    }
  },
}));
