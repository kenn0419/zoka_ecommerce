import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsString()
  paymentId: string;

  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsString()
  orderInfo: string;
}
