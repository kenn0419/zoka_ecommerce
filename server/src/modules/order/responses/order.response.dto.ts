import { Expose, Type } from 'class-transformer';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { OrderStatus } from 'src/common/enums/order.enum';
import { ShopResponseDto } from 'src/modules/shop/dto/shop-response.dto';
import { UserResponseDto } from 'src/modules/user/dto/user-response.dto';

export class OrderResponseDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  status: OrderStatus;

  @Expose()
  paymentMethod: PaymentMethod;

  @Expose()
  paymentStatus: PaymentStatus | null;

  @Expose()
  subtotal: number;

  @Expose()
  shippingFee: number;

  @Expose()
  discount: number;

  @Expose()
  totalPrice: number;

  @Expose()
  note: string;

  @Expose()
  createdAt: Date;

  @Expose()
  expiresAt?: Date | null;

  @Expose()
  @Type(() => ShopResponseDto)
  shop: ShopResponseDto;

  @Expose()
  @Type(() => UserResponseDto)
  buyer: UserResponseDto;
}
