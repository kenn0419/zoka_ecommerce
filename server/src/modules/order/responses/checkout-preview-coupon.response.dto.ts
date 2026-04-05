import { Expose } from 'class-transformer';
import { CouponScope, CouponType } from '@prisma/client';
import { CouponDisabledReason } from 'src/common/enums/coupon.enum';

export class CheckoutPreviewCouponResponseDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  description?: string;

  @Expose()
  scope: CouponScope;

  @Expose()
  type: CouponType;

  @Expose()
  discount: number;

  @Expose()
  maxDiscount?: number;

  @Expose()
  discountValue: number;

  @Expose()
  isEligible: boolean;

  @Expose()
  disabledReason?: CouponDisabledReason;
}
