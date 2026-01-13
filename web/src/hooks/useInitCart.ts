import { useCartQuery } from "../queries/cart.query";
import { useAuthStore } from "../store/auth.store";

export const useInitCart = () => {
  const user = useAuthStore((s) => s.user);

  useCartQuery(!!user);
};
