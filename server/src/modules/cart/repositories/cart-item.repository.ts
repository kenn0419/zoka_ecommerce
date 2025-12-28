import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class CartItemRepository {
  constructor(private prisma: PrismaService) {}

  addItem(data: CreateCartItemDto) {
    return this.prisma.cartItem.create({
      data: {
        cartId: data.cartId,
        productId: data.productId,
        variantId: data.variantId,
        productName: data.productName,
        variantName: data.variantName,
        imageUrl: data.imageUrl,
        priceSnapshot: data.priceSnapshot,
        quantity: data.quantity,
        stockSnapshot: data.stockSnapshot,
      },
    });
  }

  async updateQuantity(cartItemId: string, data: Prisma.CartItemUpdateInput) {
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data,
    });
  }
}
