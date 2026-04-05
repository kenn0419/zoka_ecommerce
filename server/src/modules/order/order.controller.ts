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
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { OrderService } from './services/order.service';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import {
  Serialize,
  SerializePaginated,
} from 'src/common/decorators/serialize.decorator';
import { CheckoutPreviewDto } from './dto/checkout-preview.dto';
import { CheckoutPreviewResponseDto } from './responses/checkout-preview.response.dto';
import { CheckoutConfirmDto } from './dto/checkout-confirm.dto';
import { CheckoutConfirmResponseDto } from './responses/checkout-confirm.response.dto';
import { OrderResponseDto } from './responses/order.response.dto';
import { RolesPermissionsGuard } from 'src/common/guards/rbac.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { OrderQueryDto } from './dto/order-query.dto';
import { OrderStatus } from 'src/common/enums/order.enum';
import { Idempotent } from 'src/common/decorators/idempotent.decorator';

@Controller('orders')
@UseGuards(JwtSessionGuard, RolesPermissionsGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/checkout/preview')
  @HttpCode(HttpStatus.OK)
  @Serialize(CheckoutPreviewResponseDto, 'Checkout preview successfully!')
  checkoutPreview(@Req() req, @Body() dto: CheckoutPreviewDto) {
    return this.orderService.preview(req.user.sub, dto);
  }

  @Post('/checkout/confirm')
  @Idempotent() 
  @Serialize(CheckoutConfirmResponseDto, 'Checkout confirm successfully!')
  checkoutConfirm(@Req() req, @Body() dto: CheckoutConfirmDto) {
    return this.orderService.confirm(req.user.sub, dto);
  }

  @Get('/me')
  @Roles(Role.USER)
  @SerializePaginated(OrderResponseDto, 'Fetch all my orders successfully!')
  findMyOrders(@Req() req, @Query() query: OrderQueryDto) {
    return this.orderService.findAllMyOrders(req.user.sub, query);
  }

  @Get('/shop/:shopId')
  @Roles(Role.SHOP)
  @SerializePaginated(
    OrderResponseDto,
    'Fetch all your shop orders successfully!',
  )
  findAllShopOrders(
    @Req() req,
    @Param('shopId') shopId: string,
    @Query() query: OrderQueryDto,
  ) {
    return this.orderService.findShopOrders(req.user.sub, shopId, query);
  }

  @Get()
  @Roles(Role.ADMIN)
  @SerializePaginated(OrderResponseDto, 'Fetch all orders successfully!')
  findAllOrders(@Query() query: OrderQueryDto) {
    return this.orderService.findAllOrders(query);
  }

  @Patch('/shop/:code/change-status')
  @Roles(Role.SHOP)
  @Serialize(OrderResponseDto, 'Change order status successfully!')
  changeOrderStatusByShop(
    @Req() req,
    @Param('code') code: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.changeOrderStatusByShop(
      req.user.sub,
      code,
      status,
    );
  }

  @Patch('/:id/change-status')
  @Roles(Role.ADMIN)
  @Serialize(OrderResponseDto, 'Change order status successfully!')
  changeOrderStatusByAdmin(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.changeOrderStatusByAdmin(id, status);
  }
}
