import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { OrderStatus } from 'src/common/enums/order.enum';
import { CouponRepository } from '../coupon/repositories/coupon.repository';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class OrderScheduler {
  private readonly logger = new Logger(OrderScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly couponRepo: CouponRepository,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async cancelExpiredOrders() {
    const now = new Date();

    const orders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING,
        expiresAt: { lt: now },
      },
      include: {
        items: true,
        payment: true,
      },
      take: 50,
    });

    for (const order of orders) {
      try {
        await this.prisma.$transaction(async (tx) => {
          const { count } = await tx.order.updateMany({
            where: { id: order.id, status: OrderStatus.PENDING },
            data: {
              status: OrderStatus.CANCELLED,
            },
          });

          if (count === 0) {
            return;
          }

          for (const item of order.items) {
            if (!item.variantId) {
              continue;
            }

            await tx.productVariant.update({
              where: { id: item.variantId },
              data: {
                stock: { increment: item.quantity },
              },
            });
          }

          if (order.couponId) {
            await this.couponRepo.rollbackUsed(
              order.buyerId,
              order.couponId,
              tx,
            );
          }

          if (order.paymentId) {
            await tx.payment.update({
              where: { id: order.paymentId },
              data: { status: PaymentStatus.EXPIRED },
            });
          }
        });
        this.logger.log(`Auto-cancelled order ${order.id}`);
      } catch (error) {
        this.logger.log(`Failed to cancel order ${order.id}`, error.stack);
      }
    }

    const result = await this.prisma.order.updateMany({
      where: {
        status: OrderStatus.PENDING,
        expiresAt: { lt: now },
      },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });

    if (result.count > 0) {
      this.logger.log(`Auto-cancelled ${result.count} orders`);
    }
  }
}
