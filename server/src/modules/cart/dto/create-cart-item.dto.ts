import { Decimal } from '@prisma/client/runtime/library';

export class CreateCartItemDto {
  cartId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  imageUrl: string;
  priceSnapshot: Decimal;
  quantity: number;
  stockSnapshot: number;
}
