import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { RolesPermissionsGuard } from 'src/common/guards/rbac.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import {
  Serialize,
  SerializePaginated,
} from 'src/common/decorators/serialize.decorator';
import { CouponResponseDto } from '../dto/coupon-response.dto';
import { AdminCouponService } from '../services/admin-coupon.service';
import { CouponQueryDto } from '../dto/coupon-query.dto';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';

@Controller('admin/coupons')
@UseGuards(JwtSessionGuard, RolesPermissionsGuard)
@Roles(Role.ADMIN)
export class AdminCouponController {
  constructor(private readonly couponService: AdminCouponService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Serialize(CouponResponseDto, 'Create coupon successfully!')
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @SerializePaginated(CouponResponseDto, 'Get coupons successfully!')
  findAll(@Query() query: CouponQueryDto) {
    return this.couponService.findAll(
      query.search,
      query.page,
      query.limit,
      query.sort,
    );
  }

  @Patch('/:id/active')
  @HttpCode(HttpStatus.OK)
  @Serialize(CouponResponseDto, 'Active coupon successfully!')
  activeCoupon(@Param('id') id: string) {
    return this.couponService.activeCounpon(id);
  }

  @Patch('/:id/deactivate')
  @HttpCode(HttpStatus.OK)
  @Serialize(CouponResponseDto, 'Deactivate coupon successfully!')
  deactivateCoupon(@Param('id') id: string) {
    return this.couponService.deactivateCoupon(id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @Serialize(CouponResponseDto, 'Update coupon successfully!')
  update(@Param('id') id: string, @Body() updateDto: UpdateCouponDto) {
    return this.couponService.updateCoupon(id, updateDto);
  }
}
