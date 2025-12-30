import { cartApi } from "../apis/cart.api";
import { useCartStore } from "../store/cart.store";
import type { IAddCartRequest } from "../types/cart.type";

export const cartService = {
  async getUserCartSummary() {
    const res = await cartApi.getUserCartSummary();

    useCartStore.getState().setSummary(res.data);
  },
  async getUserCart() {
    const res = await cartApi.getUserCart();
    const { items, summary } = res.data;

    useCartStore.getState().setItems(items);
    useCartStore.getState().setSummary(summary);
  },
  async clearUserCart() {
    await cartApi.clearUserCart();
    useCartStore.getState().clearCart();
  },
  async addToCart(data: IAddCartRequest) {
    const res = await cartApi.addToCart(data);

    const summary = res.data.summary;
    useCartStore.getState().setSummary(summary);
  },
};
