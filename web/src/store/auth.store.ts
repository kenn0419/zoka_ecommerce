import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: IUserResponse | null;
  setUser: (user: IUserResponse | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      reset: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
