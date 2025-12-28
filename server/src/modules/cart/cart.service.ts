import { Injectable, NotFoundException } from '@nestjs/common';
import { AddCartDto } from './dto/add-cart.dto';
import { CartRepository } from './repositories/cart.repository';
import { ProductVariantRepository } from '../product/repositories/product-variant.repository';
import { CartItemRepository } from './repositories/cart-item.repository';

@Injectable()
export class CartService {
  constructor(
    private cartRepo: CartRepository,
    private cartItemRepo: CartItemRepository,
    private productVariantRepo: ProductVariantRepository,
  ) {}

  async getUserCart(userId: string) {
    let cart = await this.cartRepo.getCartByUser(userId);
    if (!cart) {
      cart = await this.cartRepo.createCart(userId);
    }
    return this.buildCartResponse(cart);
  }

  async addToCart(userId: string, data: AddCartDto) {
    const existVariant = await this.productVariantRepo.findUnique({
      id: data.variantId,
    });
    if (!existVariant) {
      throw new NotFoundException('Product not found');
    }
    let cart = await this.getUserCart(userId);

    const existItem = cart?.items.find(
      (item) =>
        item.productId === existVariant.productId &&
        item.variantId === data.variantId,
    );
    if (existItem) {
      const currentQuantity = existItem?.quantity ?? 0;
      if (currentQuantity + data.quantity > existVariant.stock) {
        throw new NotFoundException(
          'Insufficient stock for the requested product variant',
        );
      }
      const newQuantity = existItem.quantity + data.quantity;
      await this.cartItemRepo.updateQuantity(existItem.id, {
        quantity: newQuantity,
      });
    }

    const payload = {
      cartId: cart.id,
      productId: existVariant.productId,
      variantId: data.variantId,
      productName: existVariant.product.name,
      variantName: existVariant.name,
      imageUrl: existVariant.images[0].imageUrl,
      priceSnapshot: existVariant.price,
      quantity: data.quantity,
      stockSnapshot: existVariant.stock,
    };

    await this.cartItemRepo.addItem(payload);

    cart = await this.getUserCart(userId);

    return this.buildCartResponse(cart);
  }

  async removeFromCart(cartItemId: string) {
    return this.cartRepo.removeItem(cartItemId);
  }

  async clearUserCart(userId: string) {
    const cart = await this.getUserCart(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return this.cartRepo.clearCart(cart.id);
  }

  private buildCartResponse(cart: any) {
    const items = cart.items.map((item) => {
      const subtotal = Number(item.priceSnapshot) * item.quantity;
      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName,
        variantName: item.variantName,
        imageUrl: item.imageUrl,
        priceSnapshot: Number(item.priceSnapshot),
        quantity: item.quantity,
        stockSnapshot: item.stockSnapshot,
        subtotal,
        isAvailable: item.stockSnapshot > 0,
      };
    });

    const summary = {
      totalItems: items.length,
      totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.subtotal, 0),
    };

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      summary,
      updatedAt: cart.updatedAt,
    };
  }
}
