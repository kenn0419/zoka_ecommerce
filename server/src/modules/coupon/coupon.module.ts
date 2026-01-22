import { Module } from '@nestjs/common';
import { CouponRepository } from './repositories/coupon.repository';
import { AdminCouponController } from './controller/admin-coupon.controller';
import { ShopCouponController } from './controller/shop-coupon.controller';
import { UserCouponController } from './controller/user-coupon.controller';
import { AdminCouponService } from './services/admin-coupon.service';
import { ShopModule } from '../shop/shop.module';
import { ShopCouponService } from './services/shop-coupon.service';
import { UserCouponService } from './services/user-coupon.service';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';
import { UserCouponRepository } from './repositories/user-coupon.repository';

@Module({
  imports: [ShopModule, ProductModule, CategoryModule],
  controllers: [
    AdminCouponController,
    ShopCouponController,
    UserCouponController,
  ],
  providers: [
    AdminCouponService,
    ShopCouponService,
    UserCouponService,
    CouponRepository,
    UserCouponRepository,
  ],
})
export class CouponModule {}
