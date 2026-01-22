import instance from "./axios-customize";

export const couponApi = {
  createShopCoupon: async (
    data: ICouponCreationRequest,
  ): Promise<IApiResponse<ICouponResponse>> => {
    return await instance.post(`/shop/${data.shopId}/coupons`, data);
  },

  fetchShopCoupons: async (
    shopId: string,
    params: IPaginationQueries,
  ): Promise<IApiResponse<IPaginatedResponse<ICouponResponse>>> => {
    return await instance.get(`/shop/${shopId}/coupons`, {
      params,
    });
  },

  activeShopCoupon: async (
    shopId: string,
    couponId: string,
  ): Promise<IApiResponse<ICouponResponse>> => {
    return await instance.patch(`/shop/${shopId}/coupons/${couponId}/active`);
  },

  deactiveShopCoupon: async (
    shopId: string,
    couponId: string,
  ): Promise<IApiResponse<ICouponResponse>> => {
    return await instance.patch(`/shop/${shopId}/coupons/${couponId}/deactive`);
  },

  updateShopCoupon: async (
    data: ICouponUpdateRequest,
  ): Promise<IApiResponse<ICouponResponse>> => {
    return await instance.patch(
      `/shop/${data.shopId}/coupons/${data.id}`,
      data,
    );
  },

  createGlobalCoupon: async (
    data: ICouponCreationRequest,
  ): Promise<IApiResponse<ICouponResponse>> => {
    return await instance.post(`/admin/coupons`, data);
  },

  fetchAdminCoupons: async (
    params: IPaginationQueries,
  ): Promise<IApiResponse<IPaginatedResponse<ICouponResponse>>> => {
    return await instance.get(`/admin/coupons`, {
      params,
    });
  },

  activeGlobalCoupon: async (
    couponId: string,
  ): Promise<IApiResponse<ICouponResponse>> => {
    return await instance.patch(`/admin/coupons/${couponId}/active`);
  },

  deactiveGlobalCoupon: async (
    couponId: string,
  ): Promise<IApiResponse<ICouponResponse>> => {
    return await instance.patch(`/admin/coupons/${couponId}/deactivate`);
  },

  fetchPublicCoupons: async (
    params: ICouponQueries,
  ): Promise<IApiResponse<IPaginatedResponse<ICouponResponse>>> => {
    return await instance.get(`/coupons/public`, {
      params,
    });
  },

  fetchMyCoupons: async (
    params: ICouponQueries,
  ): Promise<IApiResponse<IPaginatedResponse<ICouponResponse>>> => {
    return await instance.get(`/coupons/me`, {
      params,
    });
  },

  fetchPublicCouponsByShop: async (
    shopSlug: string,
    params: ICouponQueries,
  ): Promise<IApiResponse<IPaginatedResponse<ICouponResponse>>> => {
    return await instance.get(`/coupons/public/shop/${shopSlug}`, {
      params,
    });
  },

  fetchMyCouponsByShop: async (
    shopSlug: string,
    params: ICouponQueries,
  ): Promise<IApiResponse<IPaginatedResponse<ICouponResponse>>> => {
    return await instance.get(`/coupons/me/shop/${shopSlug}`, {
      params,
    });
  },

  claimCoupon: async (
    couponId: string,
  ): Promise<IApiResponse<ICouponResponse>> => {
    return await instance.post(`/coupons/${couponId}/claim`);
  },
};
