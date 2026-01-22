import instance from "./axios-customize";

export const cartApi = {
  getUserCartSummary: async (): Promise<IApiResponse<ICartSummaryResponse>> => {
    return await instance.get("/cart/summary");
  },
  getUserCart: async (): Promise<IApiResponse<ICartResponse>> => {
    return await instance.get("/cart");
  },
  clearUserCart: async (): Promise<IApiResponse<null>> => {
    return await instance.delete("/cart");
  },
  addToCart: async (
    data: IAddCartRequest
  ): Promise<IApiResponse<ICartResponse>> => {
    return await instance.post("/cart", data);
  },
};
