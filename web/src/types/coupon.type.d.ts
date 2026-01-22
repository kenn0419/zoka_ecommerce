type ICouponStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";
type ICouponType = "PERCENT" | "FIXED";
type ICouponScope = "GLOBAL" | "PRODUCT" | "USER" | "SHOP" | "CATEGORY";

interface ICouponResponse {
  id: string;
  code: string;
  description?: string;
  discount: number;
  type: ICouponType;
  usageLimit: number;
  usedCount: number;
  minOrder?: number;
  maxDiscount?: number;
  scope: ICouponScope;
  status: ICouponStatus;
  startAt?: string;
  endAt?: string;
  createdAt: string;
  categoryIds?: string[];
  isClaimed: boolean;
  remaining: number;
}

type ICouponSort =
  | "NEWEST"
  | "OLDEST"
  | "START_AT_ASC"
  | "START_AT_DESC"
  | "END_AT_ASC"
  | "END_AT_DESC";

interface ICouponCreationRequest {
  shopId: string;
  description?: string;
  type: ICouponType;
  discount: number;
  maxDiscount?: number;
  minOrder?: number;
  usageLimit?: number;
  scope: ICouponScope;
  startAt?: string;
  endAt?: string;
  productIds?: string[];
}

interface ICouponUpdateRequest {
  id: string;
  shopId?: string;
  description?: string;
  type?: ICouponType;
  discount?: number;
  maxDiscount?: number;
  minOrder?: number;
  usageLimit?: number;
  scope?: ICouponScope;
  startAt?: string;
  endAt?: string;
  productIds?: string[];
  categoryIds?: string[];
}

interface ICouponQueries extends IPaginationQueries {
  sort?: ICouponSort;
  scope?: ICouponScope;
  shopId?: string;
}
