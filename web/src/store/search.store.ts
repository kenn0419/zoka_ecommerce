import { create } from "zustand";

interface SearchState {
  keyword: string;
  setKeyword: (k: string) => void;
  clearKeyword: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  keyword: "",
  setKeyword: (keyword) => set({ keyword }),
  clearKeyword: () => set({ keyword: "" }),
}));
