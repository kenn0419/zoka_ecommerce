import instance from "./axios-customize";

export const shopApi = {
  registerShop: async (
    data: FormData,
  ): Promise<IApiResponse<IShopResponse>> => {
    return await instance.post("/shops/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  fetchAllMyShops: async (): Promise<IApiResponse<IShopResponse[]>> => {
    return await instance.get("/shops/me");
  },

  fetchAllShops: async ({
    page = 1,
    limit = 12,
    search,
    sort = "oldest",
  }: IPaginationQueries): Promise<
    IApiResponse<IPaginatedResponse<IShopResponse>>
  > => {
    return await instance.get("/shops", {
      params: { page, limit, search, sort },
    });
  },

  updateShopStatus: async (
    data: IShopChangeStatusRequest,
  ): Promise<IApiResponse<IShopResponse>> => {
    return await instance.patch(`/shops/${data.id}/change-status`, {
      status: data.status,
    });
  },

  fetchDetailShopBySlug: async (
    slug: string,
  ): Promise<IApiResponse<IShopResponse>> => {
    return await instance.get(`/shops/public/${slug}`);
  },
};
