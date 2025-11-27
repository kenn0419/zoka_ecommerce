import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

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
    });
  }

  async addItem(
    cartId: string,
    productId: string,
    variantId: string | null,
    quantity: number,
  ) {
    // Nếu item đã tồn tại trong cart → update quantity
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId, productId, variantId },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: { cartId, productId, variantId, quantity },
    });
  }

  async removeItem(cartItemId: string) {
    return this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async clearCart(cartId: string) {
    return this.prisma.cartItem.deleteMany({ where: { cartId } });
  }
}
