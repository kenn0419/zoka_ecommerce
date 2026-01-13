interface IProductVariantResponse {
  id: string;
  productId: string;
  name: string;
  price: number;
  stock: number;
  images: IVariantImage[];
  createdAt: Date;
  updatedAt: Date;
}
