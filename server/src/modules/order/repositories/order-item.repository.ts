import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class OrderItemRepository {
  constructor(private prisma: PrismaService) {}

  findUnique(where: Prisma.OrderItemWhereUniqueInput) {
    return this.prisma.orderItem.findUnique({
      where,
      include: {
        order: true,
        product: {
          include: {
            shop: true,
          },
        },
      },
    });
  }

  hasUserBoughtProduct(userId: string, productId: string) {
    return this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          buyerId: userId,
          status: OrderStatus.COMPLETED,
        },
      },
    });
  }

  findCompletedUnreviewedByProduct(userId: string, productId: string) {
    return this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          buyerId: userId,
          status: OrderStatus.COMPLETED,
        },
        reviews: {
          none: {},
        },
      },
    });
  }
}
