import { message } from "antd";
import { useAuthStore } from "../store/auth.store";
import { authApi } from "../apis/auth.api";
import { useCartStore } from "../store/cart.store";

function mapUser(user: any) {
  const roles = user.roles?.map((r: any) => r.role.name);
  return { ...user, roles };
}

export const authService = {
  async init() {
    const { setUser, setLoading } = useAuthStore.getState();
    try {
      setLoading(true);
      const res = await authApi.me();
      setUser(mapUser(res.data));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  },

  async signin(data: IAuthSignInRequest) {
    const { setUser, setLoading } = useAuthStore.getState();
    try {
      setLoading(true);
      const res = await authApi.signin(data);
      setUser(mapUser(res.data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data };
    } finally {
      setLoading(false);
    }
  },

  async signup(data: IAuthSignupRequest) {
    const { setCanVerify, setLoading } = useAuthStore.getState();
    try {
      setLoading(true);
      await authApi.signup(data);
      setCanVerify(true);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  },

  async verifyAccount(token: string) {
    const { setCanVerify, setLoading } = useAuthStore.getState();
    try {
      setLoading(true);
      await authApi.verifyAccount({ token });
      message.success("Xác thực thành công!");
      setCanVerify(false);
      return true;
    } catch (err: any) {
      message.error(err.response?.data?.message || "Mã OTP không hợp lệ!");
      return false;
    } finally {
      setLoading(false);
    }
  },

  async logout() {
    try {
      await authApi.logout();
    } catch {}
    useAuthStore.getState().reset();
    useCartStore.getState().clearCart();
  },
};
