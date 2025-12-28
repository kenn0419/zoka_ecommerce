import type { ICategoryResponse } from "./category.type";
import type { IProductVariant } from "./product-variant.type";
import type { IShopResponse } from "./shop.type";

export interface IProductListItemResponse {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  avgRating: number;
  minPrice: number;
  maxPrice: number;
  hasStock: boolean;
}

export interface IProductDetailResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  avgRating: number;
  minPrice: number;
  maxPrice: number;
  hasStock: boolean;
  variants: IProductVariant[];
  category: ICategoryResponse;
  shop: IShopResponse;
}
