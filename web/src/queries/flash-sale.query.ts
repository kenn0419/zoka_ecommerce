import { useMutation, useQuery } from "@tanstack/react-query";
import { flashSaleService } from "../services/flash-sale.service";

export const useActiveFlashSalesQuery = (query: IFlashSaleFilterQueries) => {
  return useQuery({
    queryKey: ["flash-sales", "active", query],
    queryFn: () => flashSaleService.fetchActiveFlashSales(query),
    staleTime: 60 * 1000,
  });
};

export const useFlashSalesByShopQuery = (shopId: string, query: IFlashSaleFilterQueries) => {
  return useQuery({
    queryKey: ["flash-sales", "shop", shopId, query],
    queryFn: () => flashSaleService.fetchFlashSalesByShop(shopId, query),
    enabled: !!shopId,
  });
};

export const useActiveFlashSalesByShopQuery = (shopId: string, query: IFlashSaleFilterQueries) => {
  return useQuery({
    queryKey: ["flash-sales", "shop", shopId, "active", query],
    queryFn: () => flashSaleService.fetchActiveFlashSalesByShop(shopId, query),
    enabled: !!shopId,
  });
};

export const useFlashSaleCreationMutation = () => {
  return useMutation({
    mutationFn: ({ shopId, data }: { shopId: string; data: any }) =>
      flashSaleService.createFlashSale(shopId, data),
  });
};
