import { shopApi } from "../apis/shop.api";

export const shopService = {
  async registerShop(data: IShopRegisterRequest): Promise<IShopResponse> {
    const formData = new FormData();
    if (data.name) {
      formData.append("name", data.name);
    }
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.logo) {
      formData.append("logo", data.logo);
    }

    const res = await shopApi.registerShop(formData);

    return res.data;
  },

  async getAllMyShops(): Promise<IShopResponse[]> {
    const res = await shopApi.getAllMyShops();
    return res.data;
  },
};
