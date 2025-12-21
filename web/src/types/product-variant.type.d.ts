export interface IProductVariant {
  id: string;
  productId: string;
  name: string;
  additionalPrice: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
