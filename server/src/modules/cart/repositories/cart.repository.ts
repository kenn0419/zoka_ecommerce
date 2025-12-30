import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { da } from '@faker-js/faker';

@Injectable()
export class CartRepository {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCartByUser(userId: string) {
    return this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                price: true,
                stock: true,
              },
            },
          },
        },
      },
    });
  }

  async removeItem(cartItemId: string) {
    return this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async clearCart(cartId: string) {
    return this.prisma.cartItem.deleteMany({ where: { cartId } });
  }
}
