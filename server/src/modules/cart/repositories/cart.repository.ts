import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { da } from '@faker-js/faker';

@Injectable()
export class CartRepository {
  constructor(private prisma: PrismaService) {}

  async getCartByUser(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true, variant: true } },
      },
    });
  }

  async createCart(userId: string) {
    return this.prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true, variant: true } } },
    });
  }

  async removeItem(cartItemId: string) {
    return this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async clearCart(cartId: string) {
    return this.prisma.cartItem.deleteMany({ where: { cartId } });
  }
}
