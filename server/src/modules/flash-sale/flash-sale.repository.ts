import { Injectable } from '@nestjs/common';
import { FlashSaleStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class FlashSaleRepository {
  constructor(private readonly prisma: PrismaService) {}

  createFlashSale(
    data: Prisma.FlashSaleCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.flashSale.create({ data, include: { items: true } });
  }

  createItems(
    data: Prisma.FlashSaleItemCreateManyInput[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.flashSaleItem.createMany({ data });
  }

  findUnique(
    where: Prisma.FlashSaleWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.flashSale.findUnique({
      where,
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }

  findActiveByVariantId(variantId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.flashSaleItem.findFirst({
      where: {
        variantId,
        flashSale: { status: FlashSaleStatus.ACTIVE },
      },
      include: {
        product: {
          include: { variants: true },
        },
        variant: true,
      },
    });
  }

  updateStatusMany(
    where: Prisma.FlashSaleItemWhereInput,
    data: Prisma.FlashSaleItemUncheckedUpdateManyInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.flashSaleItem.updateMany({ where, data });
  }

  incrementSold(
    itemId: string,
    quantity: number,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.flashSaleItem.update({
      where: { id: itemId },
      data: {
        sold: { increment: quantity },
      },
    });
  }

  checkTimeOverlap(
    shopId: string,
    startTime: Date,
    endTime: Date,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.flashSale.findFirst({
      where: {
        shopId,
        status: { in: [FlashSaleStatus.ACTIVE, FlashSaleStatus.UPCOMING] },
        OR: [
          {
            startTime: { lte: endTime },
            endTime: { gte: startTime },
          },
        ],
      },
    });
  }

  checkVariantConflict(variantIds: string[], tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.flashSaleItem.findFirst({
      where: {
        variantId: { in: variantIds },
        flashSale: {
          status: { in: [FlashSaleStatus.ACTIVE, FlashSaleStatus.UPCOMING] },
        },
      },
    });
  }

  async listPaginatedFlashSales(params: {
    where: Prisma.FlashSaleWhereInput;
    limit: number;
    page: number;
    orderBy?: Prisma.FlashSaleOrderByWithRelationInput;
  }) {
    const { where, limit, page, orderBy } = params;
    const skip = (page - 1) * limit;
    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.flashSale.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: orderBy ?? { createdAt: 'desc' },
      }),
      this.prisma.flashSale.count({ where }),
    ]);
    return { items, totalItems };
  }

  updateStatus(
    id: string,
    status: FlashSaleStatus,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.flashSale.update({
      where: { id },
      data: { status },
    });
  }

  updateStatusByTime(tx?: Prisma.TransactionClient) {
    const now = new Date();

    if (tx) {
      return Promise.all([
        tx.flashSale.updateMany({
          where: {
            status: FlashSaleStatus.UPCOMING,
            startTime: { lte: now },
            endTime: { gt: now },
          },
          data: { status: FlashSaleStatus.ACTIVE },
        }),

        tx.flashSale.updateMany({
          where: {
            status: { in: [FlashSaleStatus.ACTIVE, FlashSaleStatus.UPCOMING] },
            endTime: { lte: now },
          },
          data: { status: FlashSaleStatus.ENDED },
        }),
      ]);
    }

    return this.prisma.$transaction([
      this.prisma.flashSale.updateMany({
        where: {
          status: FlashSaleStatus.UPCOMING,
          startTime: { lte: now },
          endTime: { gt: now },
        },
        data: { status: FlashSaleStatus.ACTIVE },
      }),

      this.prisma.flashSale.updateMany({
        where: {
          status: { in: [FlashSaleStatus.ACTIVE, FlashSaleStatus.UPCOMING] },
          endTime: { lte: now },
        },
        data: { status: FlashSaleStatus.ENDED },
      }),
    ]);
  }
}
