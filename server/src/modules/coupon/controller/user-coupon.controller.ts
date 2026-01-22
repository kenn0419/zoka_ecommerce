import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserCouponService } from '../services/user-coupon.service';
import { CouponQueryDto } from '../dto/coupon-query.dto';
import {
  Serialize,
  SerializePaginated,
} from 'src/common/decorators/serialize.decorator';
import { CouponResponseDto } from '../dto/coupon-response.dto';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';

@Controller('coupons')
export class UserCouponController {
  constructor(private couponService: UserCouponService) {}

  @Get('public')
  @SerializePaginated(CouponResponseDto, 'Get all public coupons')
  getAllPublicCoupons(@Query() query: CouponQueryDto) {
    return this.couponService.findAllCoupons(query);
  }

  @Get('public/shop/:shopSlug')
  @SerializePaginated(CouponResponseDto, 'Get all public coupons by shop')
  getAllPublicCouponsByShop(
    @Param('shopSlug') shopSlug: string,
    @Query() query: CouponQueryDto,
  ) {
    return this.couponService.findAllPublicCouponsByShop(shopSlug, query);
  }

  @Get('me')
  @UseGuards(JwtSessionGuard)
  @SerializePaginated(CouponResponseDto, 'Get all my coupons')
  getMyCoupons(@Req() req, @Query() query: CouponQueryDto) {
    return this.couponService.findAllCoupons(query, req.user.userId);
  }

  @Get('me/shop/:shopSlug')
  @UseGuards(JwtSessionGuard)
  @SerializePaginated(
    CouponResponseDto,
    'Get all my coupons by shop successfully!',
  )
  getMyShopCoupons(
    @Req() req,
    @Param('shopSlug') shopSlug,
    @Query() query: CouponQueryDto,
  ) {
    return this.couponService.findAllPublicCouponsByShop(
      shopSlug,
      query,
      req.user.userId,
    );
  }

  @Post(':id/claim')
  @UseGuards(JwtSessionGuard)
  @Serialize(null, 'Claim coupon successfully.')
  claimCoupon(@Req() req, @Param('id') couponId: string) {
    return this.couponService.claimCoupon(req.user.userId, couponId);
  }

  @Get(':code')
  getCoupon(@Param('code') code: string) {
    return this.couponService.findCoupon(code);
  }
}
