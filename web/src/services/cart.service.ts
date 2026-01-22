import { cartApi } from "../apis/cart.api";

export const cartService = {
  async getUserCartSummary(): Promise<ICartSummaryResponse> {
    const res = await cartApi.getUserCartSummary();

    return res.data;
  },
  async getUserCart(): Promise<ICartResponse> {
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
