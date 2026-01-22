import { create } from "zustand";
import type { IProductFilterQueries } from "../types/product.type";

interface ProductFilterState {
  filter: IProductFilterQueries;

  setFilter: (partial: Partial<IProductFilterQueries>) => void;
  resetContext: () => void;
}

export const useProductFilterStore = create<ProductFilterState>((set) => ({
  filter: {
    page: 1,
    limit: 20,
    sort: "oldest",
  },

  setFilter: (partial) =>
    set((state) => ({
      filter: {
        ...state.filter,
        ...partial,
        page: partial.page ?? 1,
      },
    })),

  resetContext: () =>
    set({
      filter: {
        page: 1,
        limit: 20,
        sort: "oldest",
      },
    }),
}));
