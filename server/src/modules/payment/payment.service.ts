import { Injectable } from '@nestjs/common';
import { PaymentFactory } from './payment.factory';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private readonly factory: PaymentFactory) {}

  async createPayment(
    method: PaymentMethod,
    input: {
      paymentId: string;
      amount: number;
      orderInfo: string;
    },
  ) {
    const strategy = this.factory.getStrategy(method);
    return strategy.createPayment(input);
  }
}
