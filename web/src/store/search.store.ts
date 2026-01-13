import { create } from "zustand";

interface SearchState {
  search: string;
  setKeyword: (k: string) => void;
  clearKeyword: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  search: "",
  setKeyword: (search) => set({ search }),
  clearKeyword: () => set({ search: "" }),
}));
