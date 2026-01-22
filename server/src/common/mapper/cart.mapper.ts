export class CartMapper {
  static toCartResponse(cart: any) {
    const items = this.toCartItemResponses(cart);
    // const summary = this.toCartSummaryResponse(items);

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      // summary,
      updatedAt: cart.updatedAt,
    };
  }

  static toCartSummaryResponse(items: any) {
    return {
      totalItems: items.length,
      totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.subtotal, 0),
    };
  }

  static toCartItemResponses(cart: any) {
    return cart.items.map((item) => {
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
        isAvailable: item.stockSnapshot >= item.quantity,
      };
    });
  }
}
