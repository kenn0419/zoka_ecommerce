import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type IShopRegisterRequest,
  type IShopResponse,
} from "../types/shop.type";
import { shopService } from "../services/shop.service";

export const useRegisterShopMutation = () => {
  return useMutation({
    mutationFn: (data: IShopRegisterRequest) => shopService.registerShop(data),
  });
};

export const useGetAllMyShopsQuery = () => {
  return useQuery<IShopResponse[]>({
    queryKey: ["my-shops"],
    queryFn: () => shopService.getAllMyShops(),
  });
};
