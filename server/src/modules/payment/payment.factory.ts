import { Injectable } from '@nestjs/common';
import { MomoPaymentService } from './momo/momo.service';
import { VnpayPaymentService } from './vnpay/vnpay.service';
import { PaymentStrategy } from 'src/common/interfaces/payment.interface';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentFactory {
  constructor(
    private readonly momo: MomoPaymentService,
    private readonly vnpay: VnpayPaymentService,
  ) {}

  getStrategy(method: PaymentMethod): PaymentStrategy {
    switch (method) {
      case PaymentMethod.MOMO:
        return this.momo;
      case PaymentMethod.VNPAY:
        return this.vnpay;
      default:
        throw new Error('Unsupported payment method');
    }
  }
}
