import { flashSaleApi } from "../apis/flash-sale.api";

export const flashSaleService = {
  async fetchActiveFlashSales(
    query: IFlashSaleFilterQueries
  ): Promise<IPaginatedResponse<IFlashSaleResponse>> {
    const res = await flashSaleApi.fetchActiveFlashSales(query);
    return res.data;
  },

  async fetchFlashSalesByShop(
    shopId: string,
    query: IFlashSaleFilterQueries
  ): Promise<IPaginatedResponse<IFlashSaleResponse>> {
    const res = await flashSaleApi.fetchFlashSalesByShop(shopId, query);
    return res.data;
  },

  async fetchActiveFlashSalesByShop(
    shopId: string,
    query: IFlashSaleFilterQueries
  ): Promise<IPaginatedResponse<IFlashSaleResponse>> {
    const res = await flashSaleApi.fetchActiveFlashSalesByShop(shopId, query);
    return res.data;
  },

  async createFlashSale(
    shopId: string,
    data: any
  ): Promise<IFlashSaleResponse> {
    const res = await flashSaleApi.createFlashSale(shopId, data);
    return res.data;
  },
};
