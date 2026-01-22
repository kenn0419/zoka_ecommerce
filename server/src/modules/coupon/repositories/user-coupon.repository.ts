import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class UserCouponRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserAndCoupons(userId: string, couponIds: string[]) {
    return this.prisma.userCoupon.findMany({
      where: {
        userId,
        couponId: { in: couponIds },
      },
      select: { couponId: true },
    });
  }

  findUnique(
    where: Prisma.UserCouponWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.userCoupon.findUnique({ where });
  }

  create(data: Prisma.UserCouponCreateInput, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.userCoupon.create({ data });
  }

  update(
    where: Prisma.UserCouponWhereUniqueInput,
    data: Prisma.UserCouponUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.userCoupon.update({ where, data });
  }
}
