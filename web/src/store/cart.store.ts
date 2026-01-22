import { create } from "zustand";

interface CartState {
  totalItems: number;
  items: ICartItemResponse[];

  setTotalItems: (count: number) => void;
  setItems: (items: ICartItemResponse[]) => void;
  toggleItem: (id: string) => void;
  toggleAll: (checked: boolean) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  totalItems: 0,
  items: [],

  setTotalItems: (count) => set({ totalItems: count }),
  setItems: (items) => {
    set({
      items: items.map((i) => ({
        ...i,
        checked: i.isAvailable,
      })),
    });
  },

  toggleItem: (id) =>
    set({
      items: get().items.map((i) =>
        i.id === id ? { ...i, checked: !i.checked } : i
      ),
    }),

  toggleAll: (checked) =>
    set({
      items: get().items.map((i) => (i.isAvailable ? { ...i, checked } : i)),
    }),

  setQty: (id, qty) =>
    set({
      items: get().items.map((i) =>
        i.id === id
          ? {
              ...i,
              quantity: Math.min(Math.max(qty, 1), i.stockSnapshot),
            }
          : i
      ),
    }),

  clearCart: () => set({ items: [] }),
}));
