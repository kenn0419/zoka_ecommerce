import { create } from "zustand";
import type { ICartItemResponse, ICartSumary } from "../types/cart.type";

interface CartState {
  summary: ICartSumary;
  items: ICartItemResponse[];
  setSummary: (summary: ICartSumary) => void;
  setItems: (items: ICartItemResponse[]) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  summary: { totalQuantity: 0, totalItems: 0, subtotal: 0 },
  items: [],
  setSummary: (summary: ICartSumary) => set({ summary }),
  clearCart: () =>
    set({ summary: { totalQuantity: 0, totalItems: 0, subtotal: 0 } }),
  setItems: (items: ICartItemResponse[]) => {
    set({ items });
  },
}));
