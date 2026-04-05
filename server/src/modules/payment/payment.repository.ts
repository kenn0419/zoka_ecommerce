import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { PaymentProvider, PaymentStatus, Prisma } from '@prisma/client';

@Injectable()
export class PaymentRepository {
  constructor(private prisma: PrismaService) {}

  create(
    provider: PaymentProvider,
    amount: number,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.payment.create({
      data: {
        provider,
        amount,
        status: PaymentStatus.PENDING,
        requestId: crypto.randomUUID(),
      },
    });
  }

  findById(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { orders: true },
    });
  }

  async update(
    id: string,
    data: Prisma.PaymentUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return await client.payment.update({
      where: { id },
      data,
    });
  }

  async markSuccess(paymentId: string) {
    return this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.SUCCESS },
    });
  }

  async markFailed(paymentId: string) {
    return this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.FAILED },
    });
  }
}
