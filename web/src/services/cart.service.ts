import { cartApi } from "../apis/cart.api";
import type { IAddCartRequest } from "../types/cart.type";

export const cartService = {
  async getUserCartSummary() {
    const res = await cartApi.getUserCartSummary();

    return res.data;
  },
  async getUserCart() {
    const res = await cartApi.getUserCart();

    return res.data;
  },
  async clearUserCart() {
    await cartApi.clearUserCart();
    return true;
  },
  async addToCart(data: IAddCartRequest) {
    const res = await cartApi.addToCart(data);

    return res.data;
  },
};
