import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: IUserResponse | null;
  loading: boolean;
  canVerify: boolean;

  setUser: (user: IUserResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setCanVerify: (value: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      canVerify: false,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setCanVerify: (value) => set({ canVerify: value }),

      reset: () =>
        set({
          user: null,
          canVerify: false,
          loading: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
