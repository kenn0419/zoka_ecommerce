import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CouponRepository } from './coupon.repository';
import { Coupon, Prisma } from 'generated/prisma';

@Injectable()
export class CouponService {
  constructor(private couponRepo: CouponRepository) {}

  async getCoupon(code: string) {
    const coupon = await this.couponRepo.findByCode(code);
    if (!coupon) throw new NotFoundException('Coupon not found or expired');
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }
    return coupon;
  }

  calculateDiscount(totalPrice: Prisma.Decimal, coupon: Coupon) {
    let discount = new Prisma.Decimal(0);

    if (coupon.minOrder && totalPrice.lessThan(coupon.minOrder)) {
      throw new BadRequestException(
        `Order must be at least ${coupon.minOrder.toString()} to use this coupon`,
      );
    }

    if (coupon.type === 'FIXED') {
      discount = new Prisma.Decimal(coupon.discount);
    } else if (coupon.type === 'PERCENTAGE') {
      discount = totalPrice.mul(coupon.discount).div(100);
    }

    return discount;
  }
}
