import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class CouponRepository {
  constructor(private prisma: PrismaService) {}

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

  async incrementUsage(couponId: string) {
    return this.prisma.coupon.update({
      where: { id: couponId },
      data: { usedCount: { increment: 1 } },
    });
  }
}
