import { useQuery } from "@tanstack/react-query";
import { statisticsApi } from "../apis/statistics.api";

export const useAdminRevenueQuery = (params: IRevenueQueries) => {
  return useQuery({
    queryKey: ["statistics", "admin", "revenue", params],
    queryFn: async () => {
      const res = await statisticsApi.fetchAdminRevenue(params);
      return res.data;
    },
  });
};

export const useShopRevenueQuery = (shopId: string, params: IRevenueQueries) => {
  return useQuery({
    queryKey: ["statistics", "shop", shopId, "revenue", params],
    queryFn: async () => {
      const res = await statisticsApi.fetchShopRevenue(shopId, params);
      return res.data;
    },
    enabled: !!shopId,
  });
};
