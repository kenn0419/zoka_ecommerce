import type { ICategoryResponse } from "./category.type";
import type { IProductVariant } from "./product-variant.type";
import type { IShopResponse } from "./shop.type";

export interface IProductResponse {
  id: string;
  shopId: string;
  name: string;
  slug: string;
  description: string;
  price: Float;
  stock: number;
  status: string;
  thumbnail: string;
  avgRating: Float;
  createdAt: DateTime;
  updatedAt: DateTime;
  category: ICategoryResponse;
  shop: IShopResponse;
  variants: IProductVariant[];
}
