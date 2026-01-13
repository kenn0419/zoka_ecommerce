import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SellerState {
  currentShopId: string | null;
  setCurrentShopId: (id: string) => void;
  clearCurrentShopId: () => void;
}

export const useSellerStore = create<SellerState>()(
  persist(
    (set) => ({
      currentShopId: null,
      setCurrentShopId: (id) => set({ currentShopId: id }),
      clearCurrentShopId: () => set({ currentShopId: null }),
    }),
    { name: "seller-store" }
  )
);
