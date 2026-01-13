import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class ShopRepository {
  constructor(private prisma: PrismaService) {}

  countShopsByOwnerId(ownerId: string) {
    return this.prisma.shop.count({ where: { ownerId } });
  }

  createShop(data: Prisma.ShopCreateInput) {
    return this.prisma.shop.create({ data });
  }

  findShopsByOwner(userId: string) {
    return this.prisma.shop.findMany({
      where: { ownerId: userId },
      include: { owner: true },
    });
  }
  findOne(where: Prisma.ShopWhereUniqueInput) {
    return this.prisma.shop.findUnique({ where });
  }

  update(where: Prisma.ShopWhereUniqueInput, data: Prisma.ShopUpdateInput) {
    return this.prisma.shop.update({ where, data });
  }
}
