import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from './repositories/cart.repository';
import { ProductModule } from '../product/product.module';
import { CartItemRepository } from './repositories/cart-item.repository';

@Module({
  imports: [ProductModule],
  controllers: [CartController],
  providers: [CartService, CartRepository, CartItemRepository],
})
export class CartModule {}
