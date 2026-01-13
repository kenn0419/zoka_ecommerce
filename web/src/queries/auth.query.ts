import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { authService } from "../services/auth.service";
import { useEffect } from "react";
import { useCartStore } from "../store/cart.store";
import { useSellerStore } from "../store/seller.store";
import { message } from "antd";

export const useMeQuery = () => {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery({
    queryKey: ["me"],
    queryFn: authService.me,
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      setUser({ ...query.data });
    }

    if (query.isError) {
      setUser(null);
    }
  }, [query.data, query.isError, setUser]);

  return query;
};

export const useSigninMutation = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: authService.signin,
    onSuccess: (data) => {
      setUser({ ...data.user });
    },
    onError: (err: any) => message.error(err.response.data.message),
  });
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: authService.signup,
  });
};

export const useVerifyAccountMutation = () =>
  useMutation({
    mutationFn: authService.verifyAccount,
  });

export const useResendVerifyMutation = () =>
  useMutation({
    mutationFn: (email: string) => authService.resendVerifyEmail(email),
    onSuccess: () => message.success("Đã gửi lại mã xác thực"),
    onError: (err: any) => message.error(err.response.data.message),
  });

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const resetAuth = useAuthStore((s) => s.reset);
  const clearCart = useCartStore((s) => s.clearCart);
  const clearCurrentShop = useSellerStore((s) => s.clearCurrentShopId);

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      resetAuth();
      clearCart();
      clearCurrentShop();

      queryClient.clear();
    },
  });
};
