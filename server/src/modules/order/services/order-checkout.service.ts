import { BadRequestException, Injectable } from '@nestjs/common';
import { Coupon, CouponScope, CouponType } from '@prisma/client';
import { groupByMap } from 'src/common/utils/group-by.util';
import { CartItemWithProduct } from '../types/cart-item-with-product.type';
import { CalculatedShopOrder } from '../types/calculated-shop-order.type';

@Injectable()
export class OrderCheckoutService {
  calculateDiscount(coupon: Coupon, subtotal: number) {
    let discount =
      coupon.type === CouponType.PERCENTAGE
        ? (subtotal * Number(coupon.discount)) / 100
        : Number(coupon.discount);

    if (coupon.maxDiscount) {
      discount = Math.min(discount, Number(coupon.maxDiscount));
    }

    return Math.max(0, discount);
  }

  calculateShopOrders(
    cartItems: CartItemWithProduct[],
    coupon: Coupon | null,
  ): CalculatedShopOrder[] {
    const shopMap = groupByMap(cartItems, (i) => i.product.shopId);
    const result: CalculatedShopOrder[] = [];

    const totalSubtotal = cartItems.reduce(
      (s, i) => s + Number(i.priceSnapshot) * i.quantity,
      0,
    );

    let remainingGlobalDiscount = 0;

    if (coupon?.scope === CouponScope.GLOBAL) {
      if (coupon.minOrder && totalSubtotal < Number(coupon.minOrder)) {
        throw new BadRequestException('Order not eligible for coupon');
      }
      remainingGlobalDiscount = this.calculateDiscount(coupon, totalSubtotal);
    }

    for (const [shopId, items] of shopMap.entries()) {
      const subtotal = items.reduce(
        (s, i) => s + Number(i.priceSnapshot) * i.quantity,
        0,
      );

      let discount = 0;

      if (coupon?.scope === CouponScope.SHOP && coupon.shopId === shopId) {
        if (coupon.minOrder && subtotal < Number(coupon.minOrder)) {
          throw new BadRequestException('Order not eligible for coupon');
        }
        discount = this.calculateDiscount(coupon, subtotal);
      }

      if (coupon?.scope === CouponScope.GLOBAL && remainingGlobalDiscount > 0) {
        const maxDiscountForShop = this.calculateDiscount(coupon, subtotal);

        discount = Math.min(
          subtotal,
          maxDiscountForShop,
          remainingGlobalDiscount,
        );
        remainingGlobalDiscount -= discount;
      }

      const shippingFee = subtotal > 500_000 ? 0 : 30_000;
      const total = subtotal + shippingFee - discount;

      result.push({
        shopId,
        shopName: items[0].product.shop.name,
        items,
        subtotal,
        shippingFee,
        discount,
        total,
      });
    }

    return result;
  }

  calculateSummary(shops: CalculatedShopOrder[]) {
    return {
      subtotal: shops.reduce((s, i) => s + i.subtotal, 0),
      shippingFee: shops.reduce((s, i) => s + i.shippingFee, 0),
      discount: shops.reduce((s, i) => s + i.discount, 0),
      total: shops.reduce((s, i) => s + i.total, 0),
    };
  }
}
