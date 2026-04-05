import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './product.controller';
import { ProductUploadService } from './services/product-upload.service';
import { UploadModule } from 'src/infrastructure/upload/upload.module';
import { CategoryModule } from '../category/category.module';
import { ProductRepository } from './repositories/product.repository';
import { ProductVariantRepository } from './repositories/product-variant.repository';
import { RbacModule } from '../rbac/rbac.module';
import { ConfigModule } from '@nestjs/config';
import { ShopModule } from '../shop/shop.module';
import { VariantImageRepository } from './repositories/variant-image.repository';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    UploadModule,
    CategoryModule,
    RbacModule,
    UploadModule,
    ConfigModule,
    ShopModule,
  ],
  exports: [ProductVariantRepository, ProductRepository],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductUploadService,
    ProductRepository,
    ProductVariantRepository,
    VariantImageRepository,
  ],
})
export class ProductModule {}
