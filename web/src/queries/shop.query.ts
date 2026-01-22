import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { shopService } from "../services/shop.service";

export const useRegisterShopMutation = () => {
  return useMutation({
    mutationFn: (data: IShopRegisterRequest) => shopService.registerShop(data),
  });
};

export const useGetAllMyShopsQuery = () => {
  return useQuery<IShopResponse[]>({
    queryKey: ["my-shops"],
    queryFn: () => shopService.fetchAllMyShops(),
  });
};

export const useGetAllShopsQuery = (query: IPaginationQueries) => {
  return useQuery<IPaginatedResponse<IShopResponse>>({
    queryKey: ["shops"],
    queryFn: () => shopService.fetchAllShops(query),
    placeholderData: keepPreviousData,
  });
};

export const useShopStatusChangeQuery = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: shopService.changeShopStatus,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shops"] }),
  });
};

export const useDetailShopBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: ["shop", "detail", slug],
    queryFn: () => shopService.fetchDetailShopBySlug(slug),
  });
};
