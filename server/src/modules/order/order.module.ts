import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderCheckoutService } from './services/order-checkout.service';
import { OrderController } from './order.controller';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { OrderRepository } from './repositories/order.repository';
import { CartModule } from '../cart/cart.module';
import { OrderPaymentListener } from './order-payment.listener';
import { CouponModule } from '../coupon/coupon.module';
import { AddressModule } from '../address/address.module';
import { ShopModule } from '../shop/shop.module';
import { OrderItemRepository } from './repositories/order-item.repository';
import { OrderScheduler } from './order.scheduler';

@Module({
  imports: [PaymentModule, CartModule, CouponModule, AddressModule, ShopModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderCheckoutService,
    OrderRepository,
    OrderItemRepository,
    OrderPaymentListener,
    OrderScheduler,
  ],
  exports: [OrderService, OrderRepository, OrderItemRepository],
})
export class OrderModule {}
