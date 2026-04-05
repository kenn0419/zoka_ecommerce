import instance from "./axios-customize";

export const flashSaleApi = {
  fetchActiveFlashSales: async (
    query: IFlashSaleFilterQueries
  ): Promise<IApiResponse<IPaginatedResponse<IFlashSaleResponse>>> => {
    return await instance.get("/flash-sales/active", { params: query });
  },

  fetchFlashSalesByShop: async (
    shopId: string,
    query: IFlashSaleFilterQueries
  ): Promise<IApiResponse<IPaginatedResponse<IFlashSaleResponse>>> => {
    return await instance.get(`/flash-sales/${shopId}`, { params: query });
  },

  fetchActiveFlashSalesByShop: async (
    shopId: string,
    query: IFlashSaleFilterQueries
  ): Promise<IApiResponse<IPaginatedResponse<IFlashSaleResponse>>> => {
    return await instance.get(`/flash-sales/${shopId}/active`, { params: query });
  },

  createFlashSale: async (
    shopId: string,
    data: any // I'll use any for now or define a DTO if needed
  ): Promise<IApiResponse<IFlashSaleResponse>> => {
    return await instance.post(`/flash-sales/${shopId}`, data);
  },
};
