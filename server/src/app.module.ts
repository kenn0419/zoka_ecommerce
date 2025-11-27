import { Module, OnModuleInit } from '@nestjs/common';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './modules/category/category.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { ProfileModule } from './modules/profile/profile.module';
import jwtConfig from './config/jwt.config';
import { JwtGlobalModule } from './config/jwt.module';
import { ProductModule } from './modules/product/product.module';
import { ShopModule } from './modules/shop/shop.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { SeederModule } from './infrastructure/seeder/seeder.module';
import { RbacSeeder } from './infrastructure/seeder/rbac.seeder';
import { UserSeeder } from './infrastructure/seeder/user.seeder';
import { CartModule } from './module/cart/cart.module';
import { CartModule } from './modules/cart/cart.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [jwtConfig],
    }),
    JwtGlobalModule,
    RedisModule,
    PrismaModule,
    UserModule,
    AuthModule,
    CategoryModule,
    MailModule,
    ProfileModule,
    ProductModule,
    ShopModule,
    RbacModule,
    SeederModule,
    CartModule,
    CouponModule,
    OrderModule,
  ],
})
export class AppModule {}
