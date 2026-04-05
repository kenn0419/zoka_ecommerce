import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { OrderStatus } from 'src/common/enums/order.enum';
import { PaymentStatus } from '@prisma/client';
import { FlashSaleRepository } from './flash-sale.repository';

@Injectable()
export class FlashSaleScheduler {
  private readonly logger = new Logger(FlashSaleScheduler.name);

  constructor(private readonly flashSaleRepo: FlashSaleRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleFlashSaleStatus() {
    return this.flashSaleRepo.updateStatusByTime();
  }
}
