import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class ShopRepository {
  constructor(private prisma: PrismaService) {}

  createShop(data: Prisma.ShopCreateInput) {
    return this.prisma.shop.create({ data });
  }

  getShopByOwner(userId: string) {
    return this.prisma.shop.findFirst({
      where: { ownerId: userId },
      include: { owner: true },
    });
  }

  findShopById(where: Prisma.ShopWhereUniqueInput) {
    return this.prisma.shop.findUnique({ where });
  }

  update(where: Prisma.ShopWhereUniqueInput, data: Prisma.ShopUpdateInput) {
    return this.prisma.shop.update({ where, data });
  }
}
