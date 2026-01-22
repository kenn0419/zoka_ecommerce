import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CouponRepository } from '../repositories/coupon.repository';
import { Coupon, Prisma } from 'generated/prisma';
import { CouponQueryDto } from '../dto/coupon-query.dto';
import { CouponStatus } from 'src/common/enums/coupon-status.enum';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { paginatedResult } from 'src/common/utils/pagninated-result.util';
import { buildCouponSort } from 'src/common/utils/coupon-sort.util';
import { UserCouponRepository } from '../repositories/user-coupon.repository';
import { ShopRepository } from 'src/modules/shop/shop.repository';
import { ShopStatus } from 'src/common/enums/shop-status.enum';

@Injectable()
export class UserCouponService {
  constructor(
    private readonly couponRepo: CouponRepository,
    private readonly shopRepo: ShopRepository,
    private readonly userCouponRepo: UserCouponRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAllCoupons(query: CouponQueryDto, userId?: string) {
    const where: Prisma.CouponWhereInput = {
      status: CouponStatus.ACTIVE,
      scope: query.scope,
      shopId: query.scope === 'SHOP' ? query.shopId : undefined,
      AND: [
        {
          OR: [{ startAt: null }, { startAt: { lte: new Date() } }],
        },
        {
          OR: [{ endAt: null }, { endAt: { gte: new Date() } }],
        },
        {
          OR: [
            { usageLimit: null },
            { usedCount: { lt: this.prisma.coupon.fields.usageLimit } },
          ],
        },
      ],
    };

    const result = await paginatedResult(
      {
        where,
        page: query.page,
        limit: query.limit,
        orderBy: buildCouponSort(query.sort),
      },
      (args) => this.couponRepo.listPaginatedCoupons(args),
    );

    return this.enrichCoupons(result, userId);
  }

  async claimCoupon(userId: string, couponId: string) {
    return this.prisma.$transaction(async (tx) => {
      const coupon = await this.couponRepo.findUnique({ id: couponId }, tx);

      if (!coupon || coupon.status !== CouponStatus.ACTIVE) {
        throw new BadRequestException('Coupon is not available.');
      }

      this.validateCoupon(coupon);

      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        throw new BadRequestException('Coupon is out of stock.');
      }

      const userCoupon = await this.userCouponRepo.findUnique({
        userId_couponId: {
          userId,
          couponId,
        },
      });

      if (userCoupon) {
        throw new BadRequestException('Coupon is claimed.');
      }

      await this.userCouponRepo.create({
        user: { connect: { id: userId } },
        coupon: { connect: { id: couponId } },
        usedAt: new Date(),
      });

      await this.couponRepo.update(
        { id: couponId },
        { usedCount: { increment: 1 } },
      );

      return null;
    });
  }

  async findAllPublicCouponsByShop(
    shopSlug: string,
    query: CouponQueryDto,
    userId?: string,
  ) {
    const existShop = await this.shopRepo.findUnique({ slug: shopSlug });
    if (!existShop || existShop.status !== ShopStatus.ACTIVE) {
      throw new BadRequestException('Shop is not approved yet.');
    }
    const where: Prisma.CouponWhereInput = {
      status: CouponStatus.ACTIVE,
      scope: query.scope,
      shopId: existShop.id,
      AND: [
        {
          OR: [{ startAt: null }, { startAt: { lte: new Date() } }],
        },
        {
          OR: [{ endAt: null }, { endAt: { gte: new Date() } }],
        },
        {
          OR: [
            { usageLimit: null },
            { usedCount: { lt: this.prisma.coupon.fields.usageLimit } },
          ],
        },
      ],
    };

    const result = await paginatedResult(
      {
        where,
        page: query.page,
        limit: query.limit,
        orderBy: buildCouponSort(query.sort),
      },
      (args) => this.couponRepo.listPaginatedCoupons(args),
    );

    return this.enrichCoupons(result, userId);
  }

  async findCoupon(code: string) {
    const coupon = await this.couponRepo.findUnique({ code });
    if (!coupon || coupon.status !== 'ACTIVE')
      throw new NotFoundException('Coupon not found or expired');
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    this.validateCoupon(coupon);
    return coupon;
  }

  calculateDiscount(totalPrice: Prisma.Decimal, coupon: Coupon) {
    if (coupon.minOrder && totalPrice.lessThan(coupon.minOrder)) {
      throw new BadRequestException(
        `Order must be at least ${coupon.minOrder.toString()} to use this coupon`,
      );
    }

    let discount =
      coupon.type === 'FIXED'
        ? new Prisma.Decimal(coupon.discount)
        : totalPrice.mul(coupon.discount).div(100);

    if (coupon.maxDiscount) {
      discount = Prisma.Decimal.min(
        discount,
        new Prisma.Decimal(coupon.maxDiscount),
      );
    }

    return discount;
  }

  private async enrichCoupons(result: any, userId?: string) {
    let claimedSet = new Set<string>();
    if (userId && result.items.length > 0) {
      const couponIds = result.items.map((coupon) => coupon.id);

      const claimed = await this.userCouponRepo.findByUserAndCoupons(
        userId,
        couponIds,
      );
      claimedSet = new Set(claimed.map((item) => item.couponId));
    }

    const items = result?.items?.map((coupon) => ({
      ...coupon,
      isClaimed: claimedSet.has(coupon.id),
      remaining: coupon.usageLimit
        ? coupon.usageLimit - coupon.usedCount
        : Math.max(coupon.usageLimit - coupon.usedCount, 0),
    }));

    return { ...result, items };
  }

  private validateCoupon(coupon: Coupon) {
    const now = new Date();

    if (coupon.startAt && coupon.startAt > now) {
      throw new BadRequestException('Coupon not started');
    }

    if (coupon.endAt && coupon.endAt < now) {
      throw new BadRequestException('Coupon expired');
    }
  }
}
