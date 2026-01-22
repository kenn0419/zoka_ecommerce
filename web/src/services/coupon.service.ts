import { couponApi } from "../apis/coupon.api";

export const couponService = {
  async createShopCoupon(
    data: ICouponCreationRequest,
  ): Promise<ICouponResponse> {
    const res = await couponApi.createShopCoupon(data);
    return res.data;
  },

  async fetchShopCoupons(
    shopId: string,
    params: IPaginationQueries,
  ): Promise<IPaginatedResponse<ICouponResponse>> {
    const res = await couponApi.fetchShopCoupons(shopId, params);
    return res.data;
  },

  async activeShopCoupon(
    shopId: string,
    couponId: string,
  ): Promise<ICouponResponse> {
    const res = await couponApi.activeShopCoupon(shopId, couponId);
    return res.data;
  },

  async deactiveShopCoupon(
    shopId: string,
    couponId: string,
  ): Promise<ICouponResponse> {
    const res = await couponApi.deactiveShopCoupon(shopId, couponId);
    return res.data;
  },

  async updateShopCoupon(data: ICouponUpdateRequest): Promise<ICouponResponse> {
    const res = await couponApi.updateShopCoupon(data);
    return res.data;
  },

  async createGlobalCoupon(
    data: ICouponCreationRequest,
  ): Promise<ICouponResponse> {
    const res = await couponApi.createGlobalCoupon(data);
    return res.data;
  },

  async fetchAdminCoupons(
    params: IPaginationQueries,
  ): Promise<IPaginatedResponse<ICouponResponse>> {
    const res = await couponApi.fetchAdminCoupons(params);
    return res.data;
  },

  async activeGlobalCoupon(couponId: string): Promise<ICouponResponse> {
    const res = await couponApi.activeGlobalCoupon(couponId);
    return res.data;
  },

  async deactiveGlobalCoupon(couponId: string): Promise<ICouponResponse> {
    const res = await couponApi.deactiveGlobalCoupon(couponId);
    return res.data;
  },

  async fetchPublicCoupons(
    params: ICouponQueries,
  ): Promise<IPaginatedResponse<ICouponResponse>> {
    const res = await couponApi.fetchPublicCoupons(params);
    return res.data;
  },

  async fetchMyCoupons(
    params: ICouponQueries,
  ): Promise<IPaginatedResponse<ICouponResponse>> {
    const res = await couponApi.fetchMyCoupons(params);
    return res.data;
  },

  async fetchPublicCouponsByShop(
    shopSlug: string,
    params: ICouponQueries,
  ): Promise<IPaginatedResponse<ICouponResponse>> {
    const res = await couponApi.fetchPublicCouponsByShop(shopSlug, params);
    return res.data;
  },

  async fetchMyCouponsByShop(
    shopSlug: string,
    params: ICouponQueries,
  ): Promise<IPaginatedResponse<ICouponResponse>> {
    const res = await couponApi.fetchMyCouponsByShop(shopSlug, params);
    return res.data;
  },

  async claimCoupon(couponId: string): Promise<ICouponResponse> {
    const res = await couponApi.claimCoupon(couponId);

    return res.data;
  },
};
