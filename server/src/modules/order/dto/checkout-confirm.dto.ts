import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CheckoutConfirmNoteDto } from './checkout-confirm-note.dto';
import { PaymentMethod } from '@prisma/client';

export class CheckoutConfirmDto {
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutConfirmNoteDto)
  shopNotes?: CheckoutConfirmNoteDto[];

  @IsOptional()
  @IsString()
  couponCode?: string;
}
