import { ProductStatus } from '@prisma/client';

export class CartMapper {
  static toCartResponse(cart: any) {
    const items = this.toCartItemResponses(cart);

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      updatedAt: cart.updatedAt,
    };
  }

  static toCartSummaryResponse(items: any[]) {
    const availableItems = items.filter((i) => i.isAvailable);

    return {
      totalItems: availableItems.length,
      totalQuantity: availableItems.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: availableItems.reduce((sum, i) => sum + i.subtotal, 0),
    };
  }

  static toCartItemResponses(cart: any) {
    return cart.items.map((item) => {
      const displayPrice = Number(item.displayPrice);
      const availableStock = Number(item.availableStock);

      const isAvailable =
        item.product.status === ProductStatus.ACTIVE && availableStock > 0;

      const subtotal = displayPrice * item.quantity;

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName,
        variantName: item.variantName,
        imageUrl: item.imageUrl,
        displayPrice,
        quantity: item.quantity,
        availableStock,
        isSelected: item.isSelected,
        isFlashSale: item.isFlashSale ?? false,
        subtotal,
        isAvailable,
      };
    });
  }
}
