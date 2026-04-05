import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CouponDisabledReason } from 'src/common/enums/coupon.enum';
import { CouponScope, CouponStatus, CouponType } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CartItemWithProduct } from 'src/modules/order/types/cart-item-with-product.type';

@Injectable()
export class CouponRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    where: Prisma.CouponWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.coupon.findUnique({ where });
  }

  async findByCode(code: string) {
    return this.prisma.coupon.findFirst({
      where: {
        code,
        status: 'ACTIVE',
        startAt: { lte: new Date() },
        OR: [{ endAt: null }, { endAt: { gte: new Date() } }],
      },
    });
  }

  update(
    where: Prisma.CouponWhereUniqueInput,
    data: Prisma.CouponUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.coupon.update({ where, data });
  }

  async incrementUsage(couponId: string) {
    return this.prisma.coupon.update({
      where: { id: couponId },
      data: { usedCount: { increment: 1 } },
    });
  }

  create(data: any) {
    return this.prisma.coupon.create({ data });
  }

  async listPaginatedCoupons(params: {
    where: Prisma.CouponWhereInput;
    limit: number;
    page: number;
    orderBy?: Prisma.CouponOrderByWithRelationInput;
  }) {
    const { where, limit, page, orderBy } = params;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return { items, totalItems };
  }

  async markUsed(
    userId: string,
    couponId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    await client.coupon.update({
      where: { id: couponId },
      data: {
        usedCount: { increment: 1 },
      },
    });

    await client.userCoupon.upsert({
      where: {
        userId_couponId: {
          userId,
          couponId,
        },
      },
      update: {
        used: true,
        usedAt: new Date(),
      },
      create: {
        userId,
        couponId,
        used: true,
        usedAt: new Date(),
      },
    });
  }

  async rollbackUsed(
    userId: string,
    couponId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    await client.coupon.update({
      where: { id: couponId },
      data: {
        usedCount: { decrement: 1 },
      },
    });

    await client.userCoupon.update({
      where: {
        userId_couponId: {
          userId,
          couponId,
        },
      },
      data: {
        used: false,
        usedAt: undefined,
      },
    });
  }

  hasUserUsed(userId: string, couponId: string) {
    return this.prisma.userCoupon.findUnique({
      where: { userId_couponId: { userId, couponId } },
    });
  }

  async findCouponsForCheckoutPreview(
    userId: string,
    cartItems: CartItemWithProduct[],
  ) {
    const now = new Date();

    const totalSubtotal = cartItems.reduce(
      (s, i) => s + Number(i.priceSnapshot) * i.quantity,
      0,
    );

    const shopSubtotalMap = new Map<string, number>();
    for (const item of cartItems) {
      const shopId = item.product.shopId;
      shopSubtotalMap.set(
        shopId,
        (shopSubtotalMap.get(shopId) ?? 0) +
          Number(item.priceSnapshot) * item.quantity,
      );
    }

    const coupons = await this.prisma.coupon.findMany({
      where: {
        status: CouponStatus.ACTIVE,
        userCoupons: {
          some: { userId, used: false },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return coupons
      .map((coupon) => {
        let isEligible = true;
        let disabledReason: CouponDisabledReason | undefined;
        let discountBase = 0;

        if (
          (coupon.startAt && coupon.startAt > now) ||
          (coupon.endAt && coupon.endAt < now)
        ) {
          isEligible = false;
          disabledReason = CouponDisabledReason.EXPIRED;
        }

        if (
          isEligible &&
          coupon.usageLimit &&
          coupon.usedCount >= coupon.usageLimit
        ) {
          isEligible = false;
          disabledReason = CouponDisabledReason.USAGE_LIMIT;
        }

        if (isEligible) {
          if (coupon.scope === CouponScope.GLOBAL) {
            discountBase = totalSubtotal;
          }

          if (coupon.scope === CouponScope.SHOP) {
            if (!coupon.shopId || !shopSubtotalMap.has(coupon.shopId)) {
              isEligible = false;
              disabledReason = CouponDisabledReason.SCOPE_MISMATCH;
            } else {
              discountBase = shopSubtotalMap.get(coupon.shopId)!;
            }
          }
        }

        if (
          isEligible &&
          coupon.minOrder &&
          discountBase < Number(coupon.minOrder)
        ) {
          isEligible = false;
          disabledReason = CouponDisabledReason.MIN_ORDER;
        }

        let discountValue = 0;
        if (isEligible) {
          discountValue =
            coupon.type === CouponType.PERCENTAGE
              ? (discountBase * Number(coupon.discount)) / 100
              : Number(coupon.discount);

          if (coupon.maxDiscount) {
            discountValue = Math.min(discountValue, Number(coupon.maxDiscount));
          }
        }

        return {
          id: coupon.id,
          code: coupon.code,
          description: coupon.description,
          scope: coupon.scope,
          type: coupon.type,
          discount: Number(coupon.discount),
          maxDiscount: coupon.maxDiscount
            ? Number(coupon.maxDiscount)
            : undefined,
          discountValue,
          isEligible,
          disabledReason,
        };
      })
      .sort((a, b) => b.discountValue - a.discountValue);
  }
}
