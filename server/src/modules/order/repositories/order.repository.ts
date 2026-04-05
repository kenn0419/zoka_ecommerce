import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrderStatus } from 'src/common/enums/order.enum';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async createOrder(
    data: Prisma.OrderUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return await client.order.create({ data, include: { items: true } });
  }

  findUnique(where: Prisma.OrderWhereUniqueInput) {
    return this.prisma.order.findUnique({
      where,
      include: { items: true, shop: true },
    });
  }

  updateOrder(
    orderId: string,
    status: OrderStatus,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async updateStatusOrdersByPaymentId(
    paymentId: string,
    isSuccess: boolean,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return await client.order.updateMany({
      where: {
        paymentId,
        status: OrderStatus.PENDING,
      },
      data: {
        status: isSuccess ? OrderStatus.PAID : OrderStatus.FAILED,
        paidAt: isSuccess ? new Date() : null,
      },
    });
  }

  async listPaginatedOrders(params: {
    where: Prisma.OrderWhereInput;
    limit: number;
    page: number;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
  }) {
    const { where, limit, page, orderBy } = params;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          shop: true,
          buyer: true,
          payment: true,
          items: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { items, totalItems };
  }
}
