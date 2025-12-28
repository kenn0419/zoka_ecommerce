import { Expose } from 'class-transformer';

export class CartItemResponseDto {
  @Expose()
  id: string;

  @Expose()
  productId: string;

  @Expose()
  variantId: string;

  @Expose()
  productName: string;

  @Expose()
  variantName: string;

  @Expose()
  imageUrl: string;

  @Expose()
  priceSnapshot: number;

  @Expose()
  quantity: number;

  @Expose()
  stockSnapshot: number;

  @Expose()
  subtotal: number;

  @Expose()
  isAvailable: boolean;
}
