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

  async fetchAllMyShops(): Promise<IShopResponse[]> {
    const res = await shopApi.fetchAllMyShops();
    return res.data;
  },

  async fetchAllShops(
    query: IPaginationQueries,
  ): Promise<IPaginatedResponse<IShopResponse>> {
    const res = await shopApi.fetchAllShops(query);

    return res.data;
  },

  async changeShopStatus(
    data: IShopChangeStatusRequest,
  ): Promise<IShopResponse> {
    const res = await shopApi.updateShopStatus(data);

    return res.data;
  },

  async fetchDetailShopBySlug(slug: string): Promise<IShopResponse> {
    const res = await shopApi.fetchDetailShopBySlug(slug);

    return res.data;
  },
};
