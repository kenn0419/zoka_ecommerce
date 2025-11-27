import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CouponService } from './coupon.service';

@Controller('coupon')
export class CouponController {
  constructor(private couponService: CouponService) {}

  @Get(':code')
  getCoupon(@Param('code') code: string) {
    return this.couponService.getCoupon(code);
  }
}
