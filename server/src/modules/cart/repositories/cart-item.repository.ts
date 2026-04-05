import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { Prisma } from '@prisma/client';

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

  updateQuantity(
    cartItemId: string,
    data: Prisma.CartItemUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.cartItem.update({
      where: { id: cartItemId },
      data,
    });
  }

  getSelectedCartItemsByUser(userId: string) {
    return this.prisma.cartItem.findMany({
      where: {
        isSelected: true,
        cart: { userId },
      },
      include: {
        product: {
          include: {
            shop: true,
          },
        },
        variant: true,
      },
    });
  }

  async removeItemByIds(
    userId: string,
    cartItemIds: string[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    await client.cartItem.deleteMany({
      where: {
        id: { in: cartItemIds },
        cart: {
          userId,
        },
      },
    });
  }

  async clearCartByUserId(userId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    await client.cartItem.deleteMany({
      where: {
        cart: {
          userId,
        },
      },
    });
  }

  async updateCartItem(
    where: Prisma.CartItemWhereUniqueInput,
    data: Prisma.CartItemUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.cartItem.update({ where, data });
  }

  async updateCartItems(
    where: Prisma.CartItemWhereInput,
    data: Prisma.CartItemUpdateInput,
  ) {
    return await this.prisma.cartItem.updateMany({
      where,
      data,
    });
  }
}
