import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { couponService } from "../services/coupon.service";

export const useAllShopCoupons = (
  shopId: string,
  params: IPaginationQueries,
  options?: any,
) => {
  return useQuery<IPaginatedResponse<ICouponResponse>>({
    queryKey: ["shop", "coupons"],
    queryFn: () => couponService.fetchShopCoupons(shopId, params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useCouponShopCreationMutation = () => {
  const qc = useQueryClient();
  return useMutation<ICouponResponse, Error, ICouponCreationRequest>({
    mutationFn: couponService.createShopCoupon,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shop", "coupons"] }),
  });
};

export const useCouponShopActiveMutation = () => {
  const qc = useQueryClient();
  return useMutation<
    ICouponResponse,
    Error,
    { shopId: string; couponId: string }
  >({
    mutationFn: ({ shopId, couponId }) =>
      couponService.activeShopCoupon(shopId, couponId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shop", "coupons"] }),
  });
};

export const useCouponShopDeActiveMutation = () => {
  const qc = useQueryClient();
  return useMutation<
    ICouponResponse,
    Error,
    { shopId: string; couponId: string }
  >({
    mutationFn: ({ shopId, couponId }) =>
      couponService.deactiveShopCoupon(shopId, couponId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shop", "coupons"] }),
  });
};

export const useCouponShopUpdateMutation = () => {
  const qc = useQueryClient();
  return useMutation<ICouponResponse, Error, ICouponUpdateRequest>({
    mutationFn: couponService.updateShopCoupon,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shop", "coupons"] }),
  });
};

export const useCouponAdminCreationMutation = () => {
  const qc = useQueryClient();
  return useMutation<ICouponResponse, Error, ICouponCreationRequest>({
    mutationFn: couponService.createGlobalCoupon,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });
};

export const useAllAdminCoupons = (
  params: IPaginationQueries,
  options?: any,
) => {
  return useQuery<IPaginatedResponse<ICouponResponse>>({
    queryKey: ["admin", "coupons"],
    queryFn: () => couponService.fetchAdminCoupons(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useCouponAdminActiveMutation = () => {
  const qc = useQueryClient();
  return useMutation<ICouponResponse, Error, string>({
    mutationFn: couponService.activeGlobalCoupon,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });
};

export const useCouponAdminDeActiveMutation = () => {
  const qc = useQueryClient();
  return useMutation<ICouponResponse, Error, string>({
    mutationFn: couponService.deactiveGlobalCoupon,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });
};

export const useCouponAdminUpdateMutation = () => {
  const qc = useQueryClient();
  return useMutation<ICouponResponse, Error, ICouponUpdateRequest>({
    mutationFn: couponService.updateShopCoupon,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });
};

export const useAvailableCouponsQuery = (
  params: ICouponQueries,
  isLoggedIn: boolean,
  options?: any,
) => {
  return useQuery<IPaginatedResponse<ICouponResponse>>({
    queryKey: ["available", "coupons"],
    queryFn: () =>
      isLoggedIn
        ? couponService.fetchMyCoupons(params)
        : couponService.fetchPublicCoupons(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useAvailableCouponsByShopSlugQuery = (
  shopSlug: string,
  params: ICouponQueries,
  isLoggedIn: boolean,
  options?: any,
) => {
  return useQuery<IPaginatedResponse<ICouponResponse>>({
    queryKey: ["available", "coupons", shopSlug],
    queryFn: () =>
      isLoggedIn
        ? couponService.fetchMyCouponsByShop(shopSlug, params)
        : couponService.fetchPublicCouponsByShop(shopSlug, params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useCouponClaimMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: couponService.claimCoupon,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["available", "coupons"] }),
  });
};
