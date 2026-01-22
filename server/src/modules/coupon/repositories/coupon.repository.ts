import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

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
}
