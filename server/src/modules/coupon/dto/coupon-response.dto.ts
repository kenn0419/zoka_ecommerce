import { Expose } from 'class-transformer';
import { ShopResponseDto } from 'src/modules/shop/dto/shop-response.dto';

export class CouponResponseDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  description?: string;

  @Expose()
  type: string;

  @Expose()
  scope: string;

  @Expose()
  discount: string;

  @Expose()
  maxDiscount?: string;

  @Expose()
  minOrder?: string;

  @Expose()
  usageLimit?: number;

  @Expose()
  usedCount: number;

  @Expose()
  status: string;

  @Expose()
  startAt?: Date;

  @Expose()
  endAt?: Date;

  @Expose()
  shop?: ShopResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  isClaimed?: boolean;

  @Expose()
  remaining?: number;
}
