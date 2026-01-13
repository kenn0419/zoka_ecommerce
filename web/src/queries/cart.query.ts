import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cart.store";
import { useEffect } from "react";

export const useCartQuery = (enabled = true) => {
  const setItems = useCartStore((s) => s.setItems);
  const setSummary = useCartStore((s) => s.setSummary);

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getUserCart,
    enabled,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setItems(query.data.items);
      setSummary(query.data.summary);
    }
  }, [query.isSuccess, query.data]);

  return query;
};

export const useAddToCartMutation = () => {
  const setSummary = useCartStore((s) => s.setSummary);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: (data) => {
      setSummary(data.summary);
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
