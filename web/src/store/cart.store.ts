import { create } from "zustand";

interface CartState {
  checkedMap: Record<string, boolean>;
totalItems: number;
  init: (items: { id: string; isSelected: boolean }[]) => void;
  setTotalItems: (count: number) => void;

  toggleItem: (id: string) => void;
  toggleAll: (ids: string[], checked: boolean) => void;
  getSelectedIds: () => string[];
  clear: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  totalItems: 0,
  checkedMap: {},
  setTotalItems: (count) => set({ totalItems: count }),
  init: (items) =>
    set({
      checkedMap: Object.fromEntries(items.map((i) => [i.id, i.isSelected])),
    }),

  toggleItem: (id) =>
    set({
      checkedMap: {
        ...get().checkedMap,
        [id]: !get().checkedMap[id],
      },
    }),

  toggleAll: (ids, checked) =>
    set({
      checkedMap: Object.fromEntries(ids.map((id) => [id, checked])),
    }),

  getSelectedIds: () =>
    Object.entries(get().checkedMap)
      .filter(([_, v]) => v)
      .map(([k]) => k),

  clear: () => set({ checkedMap: {} }),
}));
