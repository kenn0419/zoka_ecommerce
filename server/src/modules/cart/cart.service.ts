import { Injectable, NotFoundException } from '@nestjs/common';
import { AddCartDto } from './dto/add-cart.dto';
import { CartRepository } from './repositories/cart.repository';
import { ProductVariantRepository } from '../product/repositories/product-variant.repository';
import { CartItemRepository } from './repositories/cart-item.repository';
import { CartMapper } from 'src/common/mapper/cart.mapper';

@Injectable()
export class CartService {
  constructor(
    private cartRepo: CartRepository,
    private cartItemRepo: CartItemRepository,
    private productVariantRepo: ProductVariantRepository,
  ) {}

  private async getOrCreateCartEntity(userId: string) {
    const cart = await this.cartRepo.getOrCreateCartByUser(userId);
    return cart;
  }

  async getUserCart(userId: string) {
    const cart = await this.getOrCreateCartEntity(userId);
    return CartMapper.toCartResponse(cart);
  }

  async getUserCartSummary(userId: string) {
    const cart = await this.getOrCreateCartEntity(userId);
    const cartItems = await CartMapper.toCartItemResponses(cart);
    return CartMapper.toCartSummaryResponse(cartItems);
  }

  async addToCart(userId: string, data: AddCartDto) {
    const existVariant = await this.productVariantRepo.findUnique({
      id: data.variantId,
    });
    if (!existVariant) {
      throw new NotFoundException('Product not found');
    }

    const cart = await this.getOrCreateCartEntity(userId);

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
    } else {
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
    }

    const updatedCart = await this.getOrCreateCartEntity(userId);
    return CartMapper.toCartResponse(updatedCart);
  }

  async removeFromCart(cartItemId: string) {
    return this.cartRepo.removeItem(cartItemId);
  }

  async clearUserCart(userId: string) {
    const cart = await this.getOrCreateCartEntity(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return this.cartRepo.clearCart(cart.id);
  }
}
