import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddCartDto } from './dto/add-cart.dto';
import { CartRepository } from './repositories/cart.repository';
import { ProductVariantRepository } from '../product/repositories/product-variant.repository';
import { CartItemRepository } from './repositories/cart-item.repository';
import { CartMapper } from 'src/common/mappers/cart.mapper';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { FlashSaleStatus, Prisma } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartRepo: CartRepository,
    private readonly cartItemRepo: CartItemRepository,
    private readonly productVariantRepo: ProductVariantRepository,
  ) {}

  async getUserCart(userId: string) {
    const cart = await this.getOrCreateCartEntity(userId);
    const syncedItems = await this.resolveCartItemsRealtime(cart);

    const itemsToUpdate = syncedItems.filter(
      (item) =>
        Number(item.priceSnapshot) !== item.displayPrice ||
        item.stockSnapshot !== item.availableStock,
    );

    if (itemsToUpdate.length > 0) {
      await this.prisma.$transaction(
        itemsToUpdate.map((item) =>
          this.cartItemRepo.updateCartItem(
            { id: item.id },
            {
              priceSnapshot: new Prisma.Decimal(item.displayPrice),
              stockSnapshot: item.availableStock,
            },
            undefined, // Transaction will be handled by $transaction
          ),
        ),
      );
    }

    const res = CartMapper.toCartResponse({
      ...cart,
      items: syncedItems,
    });

    return res;
  }

  async getUserCartSummary(userId: string) {
    const cart = await this.getOrCreateCartEntity(userId);
    const syncedItems = await this.resolveCartItemsRealtime(cart);

    return CartMapper.toCartSummaryResponse(syncedItems);
  }

  async addToCart(userId: string, data: AddCartDto) {
    const existVariant = await this.productVariantRepo.findUnique({
      id: data.variantId,
    });

    if (!existVariant) {
      throw new NotFoundException('Product variant not found');
    }

    const { price, availableStock } = await this.resolveVariantRealtime(
      data.variantId,
      existVariant,
    );

    if (data.quantity > availableStock) {
      throw new BadRequestException(
        'Insufficient stock for the requested product variant',
      );
    }

    const cart = await this.getOrCreateCartEntity(userId);

    const existItem = cart.items.find(
      (item) =>
        item.productId === existVariant.productId &&
        item.variantId === data.variantId,
    );

    if (existItem) {
      const newQuantity = existItem.quantity + data.quantity;

      if (newQuantity > availableStock) {
        throw new BadRequestException(
          'Insufficient stock for the requested product variant',
        );
      }

      await this.cartItemRepo.updateQuantity(existItem.id, {
        quantity: newQuantity,
        priceSnapshot: new Prisma.Decimal(price),
        stockSnapshot: availableStock,
      });
    } else {
      await this.cartItemRepo.addItem({
        cartId: cart.id,
        productId: existVariant.productId,
        variantId: data.variantId,
        productName: existVariant.product.name,
        variantName: existVariant.name,
        imageUrl: existVariant.images?.[0]?.imageUrl ?? null,
        priceSnapshot: new Prisma.Decimal(price),
        quantity: data.quantity,
        stockSnapshot: availableStock,
      });
    }

    return this.getUserCart(userId);
  }

  async updateItemQuantity(
    userId: string,
    cartItemId: string,
    quantity: number,
  ) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, cartItemId);
    }

    const cart = await this.getOrCreateCartEntity(userId);

    const item = cart.items.find((i) => i.id === cartItemId);
    if (!item) {
      throw new NotFoundException('Cart item not found.');
    }

    const syncedItems = await this.resolveCartItemsRealtime(cart);
    const syncedItem = syncedItems.find((i) => i.id === cartItemId)!;

    const finalQty = Math.min(quantity, syncedItem.availableStock);

    await this.cartItemRepo.updateCartItem(
      { id: cartItemId },
      {
        quantity: finalQty,
        priceSnapshot: new Prisma.Decimal(syncedItem.displayPrice),
        stockSnapshot: syncedItem.availableStock,
      },
    );

    return this.getUserCart(userId);
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const cart = await this.getOrCreateCartEntity(userId);

    const exists = cart.items.some((i) => i.id === cartItemId);
    if (!exists) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartRepo.removeItem(cartItemId);

    return this.getUserCart(userId);
  }

  async clearUserCart(userId: string) {
    const cart = await this.getOrCreateCartEntity(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return this.cartRepo.clearCart(cart.id);
  }

  async updateSelection(userId: string, cartItemIds: string[]) {
    await this.cartItemRepo.updateCartItems(
      { cart: { userId } },
      { isSelected: false },
    );

    await this.cartItemRepo.updateCartItems(
      {
        cart: { userId },
        id: { in: cartItemIds },
      },
      { isSelected: true },
    );

    return this.getUserCart(userId);
  }

  private async resolveCartItemsRealtime(cart: any) {
    if (!cart.items.length) return cart.items;

    const variantIds = cart.items.map((i) => i.variantId);

    const flashItems = await this.prisma.flashSaleItem.findMany({
      where: {
        variantId: { in: variantIds },
        flashSale: { status: FlashSaleStatus.ACTIVE },
      },
    });

    const flashMap = new Map<string, (typeof flashItems)[number]>();
    flashItems.forEach((f) => flashMap.set(f.variantId, f));

    return cart.items.map((item) => {
      const flash = flashMap.get(item.variantId);

      const price = flash
        ? Number(flash.salePrice)
        : Number(item.variant.price);

      const availableStock = flash
        ? flash.quantity - flash.sold
        : item.variant.stock;

      return {
        ...item,
        displayPrice: price,
        availableStock,
        isFlashSale: !!flash,
      };
    });
  }

  private async resolveVariantRealtime(variantId: string, variant: any) {
    const flash = await this.prisma.flashSaleItem.findFirst({
      where: {
        variantId,
        flashSale: { status: FlashSaleStatus.ACTIVE },
      },
    });

    if (!flash) {
      return {
        price: Number(variant.price),
        availableStock: variant.stock,
      };
    }

    return {
      price: Number(flash.salePrice),
      availableStock: flash.quantity - flash.sold,
    };
  }

  private async getOrCreateCartEntity(userId: string) {
    return this.cartRepo.getOrCreateCartByUser(userId);
  }
}
