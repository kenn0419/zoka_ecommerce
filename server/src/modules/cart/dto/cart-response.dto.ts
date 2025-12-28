import { Expose, Type } from 'class-transformer';
import { CartItemResponseDto } from './cart-item-response.dto';
import { CartSummaryResponseDto } from './cart-summary-response.dto';

export class CartResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  @Type(() => CartItemResponseDto)
  items: CartItemResponseDto[];

  @Expose()
  @Type(() => CartSummaryResponseDto)
  summary: CartSummaryResponseDto;

  @Expose()
  updatedAt: Date;
}
