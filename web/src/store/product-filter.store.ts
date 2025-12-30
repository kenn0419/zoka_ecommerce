import { create } from "zustand";

interface ProductFilterState {
  category: string | null;
  page: number;
  sort: string;
  setCategory: (c: string) => void;
  setPage: (p: number) => void;
}

export const useProductFilterStore = create<ProductFilterState>((set) => ({
  category: null,
  page: 1,
  sort: "price_asc",

  setCategory: (c) => set({ category: c, page: 1 }),
  setPage: (p) => set({ page: p }),
}));
