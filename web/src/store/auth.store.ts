import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../apis/auth.api";
import { message } from "antd";

interface AuthState {
  user: IUserResponse | null;
  loading: boolean;
  canVerify: boolean;

  init: () => Promise<void>;
  signin: (data: IAuthSignInRequest) => Promise<any>;
  signup: (data: IAuthSignupRequest) => Promise<boolean>;
  verifyAccount: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      canVerify: false,

      init: async () => {
        try {
          const res = await authApi.me();
          const user = res.data;
          const roles = user.roles.map((r: any) => r.role.name);

          set({ user: { ...user, roles } });
        } catch {
          set({ user: null });
        } finally {
          set({ loading: false });
        }
      },

      signin: async ({ email, password }: IAuthSignInRequest) => {
        try {
          set({ loading: true });
          const res = await authApi.signin({ email, password });
          const { user } = res.data;
          console.log(user);
          const roles = user.roles.map((r: any) => r.role.name);

          set({ user: { ...user, roles } });

          return { success: true };
        } catch (err: any) {
          return { success: false, error: err.response?.data };
        } finally {
          set({ loading: false });
        }
      },

      signup: async (data: IAuthSignupRequest) => {
        set({ loading: true });
        try {
          await authApi.signup(data);
          set({ canVerify: true });
          return true;
        } catch (err: any) {
          return false;
        } finally {
          set({ loading: false });
        }
      },

      verifyAccount: async (token: string) => {
        set({ loading: true });
        try {
          await authApi.verifyAccount({ token });

          message.success("Xác thực thành công!");
          set({ canVerify: false });

          return true;
        } catch (err: any) {
          message.error(err.response?.data?.message || "Mã OTP không hợp lệ!");
          return false;
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {}
        set({ user: null });
      },
    }),

    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
