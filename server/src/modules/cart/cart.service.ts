import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(private cartRepo: CartRepository) {}

  async getUserCart(userId: string) {
    let cart = await this.cartRepo.getCartByUser(userId);
    if (!cart) {
      return await this.cartRepo.createCart(userId);
    }
    return cart;
  }

  async addToCart(
    userId: string,
    productId: string,
    variantId: string | null,
    quantity: number,
  ) {
    const cart = await this.getUserCart(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return this.cartRepo.addItem(cart.id, productId, variantId, quantity);
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
}
