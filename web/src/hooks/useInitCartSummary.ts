import { useEffect } from "react";
import { useCartSummaryQuery } from "../queries/cart.query";
import { useAuthStore } from "../store/auth.store";
import { useCartStore } from "../store/cart.store";

export const useInitCartSummary = () => {
  const user = useAuthStore((s) => s.user);
  const setTotalItems = useCartStore((s) => s.setTotalItems);

  const { data } = useCartSummaryQuery(!!user);

  useEffect(() => {
    if (data?.totalItems) {
      setTotalItems(data.totalItems);
    }
  }, [data?.totalItems, setTotalItems]);
};
