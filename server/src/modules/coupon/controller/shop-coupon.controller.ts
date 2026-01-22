import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ShopCouponService } from '../services/shop-coupon.service';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesPermissionsGuard } from 'src/common/guards/rbac.guard';
import {
  Serialize,
  SerializePaginated,
} from 'src/common/decorators/serialize.decorator';
import { CouponResponseDto } from '../dto/coupon-response.dto';
import { CouponQueryDto } from '../dto/coupon-query.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';

@Controller('shop/:shopId/coupons')
@Roles(Role.SHOP)
@UseGuards(JwtSessionGuard, RolesPermissionsGuard)
export class ShopCouponController {
  constructor(private couponService: ShopCouponService) {}

  @Post()
  @Serialize(CouponResponseDto, 'Create shop coupon successfully!')
  create(
    @Req() req,
    @Param('shopId') shopId: string,
    @Body() data: CreateCouponDto,
  ) {
    return this.couponService.create(req.user.userId, shopId, data);
  }

  @Get()
  @SerializePaginated(CouponResponseDto, 'Get all shop coupons successfully!')
  findAll(
    @Req() req,
    @Param('shopId') shopId: string,
    @Query() query: CouponQueryDto,
  ) {
    return this.couponService.findAll(
      req.user.userId,
      shopId,
      query.search,
      query.page,
      query.limit,
      query.sort,
    );
  }

  @Get(':id')
  findById(
    @Req() req,
    @Param('shopId') shopId: string,
    @Param('id') id: string,
  ) {
    return this.couponService.findById(req.user.userId, shopId, id);
  }

  @Patch('/:id')
  update(
    @Req() req,
    @Param('shopId') shopId: string,
    @Param('id') id: string,
    @Body() data: UpdateCouponDto,
  ) {
    return this.couponService.updateCoupon(req.user.userId, shopId, id, data);
  }

  @Patch('/:id/active')
  activate(
    @Req() req,
    @Param('shopId') shopId: string,
    @Param('id') id: string,
  ) {
    return this.couponService.activeCoupon(req.user.userId, shopId, id);
  }

  @Patch('/:id/deactive')
  deactivate(
    @Req() req,
    @Param('shopId') shopId: string,
    @Param('id') id: string,
  ) {
    return this.couponService.deactivateCoupon(req.user.userId, shopId, id);
  }
}
