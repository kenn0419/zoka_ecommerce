import { create } from "zustand";
import type { IPaginatedResponse } from "../types/pagination.type";
import { productApi } from "../apis/product.api";
import type { IProductResponse } from "../types/product.type";

interface ProductState {
  product: IProductResponse | null;
  products: IProductResponse[];
  relatedProducts: IProductResponse[];
  relatedProductsCache: Record<string, IProductResponse[]>;
  fetchRelatedProducts: (categorySlug: string) => Promise<void>;
  meta: IPaginatedResponse<IProductResponse>["meta"] | null;
  loading: boolean;
  fetchActiveProducts: (
    page?: number,
    limit?: number,
    search?: string,
    sort?: string
  ) => Promise<void>;
  fetchProductsByCategory: (
    categorySlug: string,
    page?: number,
    limit?: number,
    search?: string,
    sort?: string
  ) => Promise<void>;
  fetchProductDetail: (productSlug: string) => Promise<void>;
}

export const useProductStore = create<ProductState>()((set, get) => ({
  product: null,
  products: [],
  relatedProducts: [],
  relatedProductsCache: {},
  meta: null,
  loading: false,

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
  fetchProductsByCategory: async (
    categorySlug: string,
    page = 1,
    limit = 20,
    search?,
    sort?
  ) => {
    set({ loading: true });
    try {
      const response = await productApi.fetchProductsByCategory({
        categorySlug,
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
  fetchProductDetail: async (productSlug: string) => {
    set({ loading: true });
    try {
      const response = await productApi.fetchProductDetail(productSlug);
      set({ product: response.data });
    } finally {
      set({ loading: false });
    }
  },
  fetchRelatedProducts: async (categorySlug: string) => {
    const cache = get().relatedProductsCache[categorySlug];
    if (cache) {
      set({ relatedProducts: cache });
      return;
    }

    set({ loading: true });
    try {
      const response = await productApi.fetchProductsByCategory({
        categorySlug,
        page: 1,
        limit: 6,
      });
      set((state) => ({
        relatedProducts: response.data.items,
        relatedProductsCache: {
          ...state.relatedProductsCache,
          [categorySlug]: response.data.items,
        },
      }));
    } finally {
      set({ loading: false });
    }
  },
}));
