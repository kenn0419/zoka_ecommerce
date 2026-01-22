import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cart.store";

export const useCartQuery = (enabled = true) => {
  return useQuery<ICartResponse>({
    queryKey: ["cart"],
    queryFn: cartService.getUserCart,
    enabled,
  });
};

export const useCartSummaryQuery = (enabled = true) => {
  return useQuery<ICartSummaryResponse>({
    queryKey: ["cart", "summary"],
    queryFn: cartService.getUserCartSummary,
    enabled,
    select: (res) => res,
  });
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useClearCartMutation = () => {
  const clearCart = useCartStore((s) => s.clearCart);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.clearUserCart,
    onSuccess: () => {
      clearCart();
      queryClient.removeQueries({ queryKey: ["cart"] });
    },
  });
};
