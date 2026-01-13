import type { IShopResponse } from "../types/shop.type";
import instance from "./axios-customize";

export const shopApi = {
  registerShop: async (
    data: FormData
  ): Promise<IApiResponse<IShopResponse>> => {
    return await instance.post("/shop/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getAllMyShops: async (): Promise<IApiResponse<IShopResponse[]>> => {
    return await instance.get("/shop/me");
  },
};
