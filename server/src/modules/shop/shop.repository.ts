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

  findUnique(where: Prisma.ShopWhereUniqueInput, select?: Prisma.ShopSelect) {
    return this.prisma.shop.findUnique({ where, select });
  }

  update(where: Prisma.ShopWhereUniqueInput, data: Prisma.ShopUpdateInput) {
    return this.prisma.shop.update({ where, data });
  }

  async listPaginatedShops(params: {
    where: Prisma.ShopWhereInput;
    limit: number;
    page: number;
    orderBy?: Prisma.ShopOrderByWithRelationInput;
  }) {
    const { where, limit, page, orderBy } = params;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.shop.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: true,
        },
        orderBy,
      }),
      this.prisma.shop.count({ where }),
    ]);

    return { items, totalItems };
  }
}
