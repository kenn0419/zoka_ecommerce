import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class ShopFollowerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async follow(userId: string, shopId: string) {
    return this.prisma.shopFollower.create({
      data: { userId, shopId },
    });
  }

  async unfollow(userId: string, shopId: string) {
    return this.prisma.shopFollower.delete({
      where: { shopId_userId: { userId, shopId } },
    });
  }

  finUnique(where: Prisma.ShopFollowerWhereUniqueInput) {
    return this.prisma.shopFollower.findUnique({ where });
  }

  countFollowers(shopId: string) {
    return this.prisma.shopFollower.count({ where: { shopId } });
  }

  findFollowerByShopId(shopId: string) {
    return this.prisma.shopFollower.findMany({
      where: { shopId },
      select: { userId: true },
    });
  }

  findFollowingByUserId(userId: string) {
    return this.prisma.shopFollower.findMany({
      where: { userId },
      select: { shopId: true },
    });
  }
}
