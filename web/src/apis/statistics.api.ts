import instance from "./axios-customize";



export const statisticsApi = {
  fetchAdminRevenue: (params: IRevenueQueries) => {
    return instance.get<IRevenueData[]>("/statistics/admin/revenue", {
      params,
    });
  },
  fetchShopRevenue: (shopId: string, params: IRevenueQueries) => {
    return instance.get<IRevenueData[]>(`/statistics/shop/${shopId}/revenue`, {
      params,
    });
  },
  exportAdminRevenue: (params: IRevenueQueries) => {
    return instance.get("/statistics/admin/revenue/export", {
      params,
      responseType: "blob",
    });
  },
  exportShopRevenue: (shopId: string, params: IRevenueQueries) => {
    return instance.get(`/statistics/shop/${shopId}/revenue/export`, {
      params,
      responseType: "blob",
    });
  },
};
