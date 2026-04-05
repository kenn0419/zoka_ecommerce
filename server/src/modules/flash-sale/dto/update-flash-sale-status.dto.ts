import { IsEnum } from 'class-validator';
import { FlashSaleStatus } from '@prisma/client';

export class UpdateFlashSaleStatusDto {
  @IsEnum(FlashSaleStatus)
  status: FlashSaleStatus;
}
