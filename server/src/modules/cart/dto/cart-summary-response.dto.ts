import { Expose } from 'class-transformer';

export class CartSummaryResponseDto {
  @Expose()
  totalItems: number;

  @Expose()
  totalQuantity: number;

  @Expose()
  subtotal: number;
}
