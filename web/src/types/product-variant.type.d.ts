import type { IVariantImage } from "./variant-image.type";

export interface IProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  stock: number;
  images: IVariantImage[];
  createdAt: Date;
  updatedAt: Date;
}
