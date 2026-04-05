import {
  Address,
  Coupon,
  FlashSaleStatus,
  Order,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from '@prisma/client';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import ms from 'ms';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PaymentService } from '../../payment/payment.service';
import { PaymentRepository } from '../../payment/payment.repository';
import { OrderRepository } from '../repositories/order.repository';
import { CartItemRepository } from '../../cart/repositories/cart-item.repository';
import { AddressRepository } from '../../address/address.repository';
import { CouponRepository } from '../../coupon/repositories/coupon.repository';

import { OrderSort, OrderStatus } from 'src/common/enums/order.enum';
import { CouponScope, CouponStatus, CouponType } from '@prisma/client';

import { mapMethodToProvider } from 'src/common/mappers/map-method-to-provider';
import { groupByMap } from 'src/common/utils/group-by.util';

import { CheckoutPreviewDto } from '../dto/checkout-preview.dto';
import { CheckoutConfirmDto } from '../dto/checkout-confirm.dto';
import { OrderQueryDto } from '../dto/order-query.dto';
import { paginatedResult } from 'src/common/utils/pagninated-result.util';
import { buildOrderSort } from 'src/common/utils/order-sort.util';
import { ShopRepository } from '../../shop/shop.repository';
import { generateOrderCode } from 'src/common/utils/generate-order-code.util';
import { OrderCheckoutService } from './order-checkout.service';
import { CartItemWithProduct } from '../types/cart-item-with-product.type';
import { CalculatedShopOrder } from '../types/calculated-shop-order.type';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
    private readonly paymentRepo: PaymentRepository,
    private readonly orderRepo: OrderRepository,
    private readonly cartItemRepo: CartItemRepository,
    private readonly couponRepo: CouponRepository,
    private readonly addressRepo: AddressRepository,
    private readonly shopRepo: ShopRepository,
    private readonly orderCheckoutService: OrderCheckoutService,
  ) {}

  async preview(userId: string, dto: CheckoutPreviewDto) {
    const cartItems = await this.loadAndValidateCartItems(userId);

    const address = await this.addressRepo.findDefaultByUserId(userId);

    const coupons = await this.couponRepo.findCouponsForCheckoutPreview(
      userId,
      cartItems,
    );

    let appliedCoupon: Coupon | null = null;

    if (dto.couponCode) {
      appliedCoupon = await this.validateCouponAvailability(
        userId,
        dto.couponCode,
      );
    }

    const shopOrders = this.orderCheckoutService.calculateShopOrders(cartItems, appliedCoupon);

    const summary = this.orderCheckoutService.calculateSummary(shopOrders);

    return {
      shops: shopOrders,
      summary,
      address,
      coupons,
    };
  }

  async confirm(userId: string, dto: CheckoutConfirmDto) {
    const cartItems = await this.loadAndValidateCartItems(userId);

    if (!cartItems.length) {
      throw new BadRequestException('Invalid cart items');
    }

    const address = await this.addressRepo.findDefaultByUserId(userId);
    if (!address) {
      throw new BadRequestException('Address not found');
    }

    const coupon = dto.couponCode
      ? await this.validateCouponAvailability(userId, dto.couponCode)
      : null;

    const shopOrders = this.orderCheckoutService.calculateShopOrders(cartItems, coupon);
    const totalAmount = shopOrders.reduce((s, i) => s + i.total, 0);

    let payment: Payment | null = null;
    const orders: Order[] = [];

    await this.prisma.$transaction(async (tx) => {
      await this.decrementStock(cartItems, tx);

      if (dto.paymentMethod !== PaymentMethod.COD) {
        const provider = mapMethodToProvider(dto.paymentMethod);

        payment = await this.paymentRepo.create(provider!, totalAmount, tx);
      }

      for (const shopOrder of shopOrders) {
        const note =
          dto.shopNotes?.find((n) => n.shopId === shopOrder.shopId)?.note ??
          null;

        const order = await this.createOrderTx(
          userId,
          shopOrder,
          dto.paymentMethod,
          address,
          coupon,
          payment?.id ?? null,
          note,
          tx,
        );
        orders.push(order);
      }

      if (coupon) {
        await this.couponRepo.markUsed(userId, coupon.id, tx);
      }

      const cartItemIds = cartItems.map((i) => i.id);
      await this.cartItemRepo.removeItemByIds(userId, cartItemIds, tx);
    });

    if (dto.paymentMethod === PaymentMethod.COD) {
      return { orderIds: orders.map((o) => o.id) };
    }

    const payRes = await this.paymentService.createPayment(dto.paymentMethod, {
      paymentId: payment!.id,
      amount: Number(payment!.amount),
      orderInfo: `Payment ${payment!.id}`,
    });

    return {
      paymentId: payment!.id,
      orderIds: orders.map((o) => o.id),
      payUrl: payRes.payUrl,
    };
  }

  async handlePaymentResult(paymentId: string, success: boolean) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        orders: {
          include: { items: true },
        },
      },
    });

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    if (payment.status !== PaymentStatus.PENDING) {
      return;
    }

    const couponId = payment.orders.find((o) => o.couponId)?.couponId;
    if (!payment.orders.length) {
      throw new BadRequestException('Payment has no orders');
    }
    const buyerId = payment.orders[0]?.buyerId;

    await this.prisma.$transaction(async (tx) => {
      if (success) {
        await tx.payment.update({
          where: { id: paymentId },
          data: { status: PaymentStatus.SUCCESS },
        });

        const updated = await tx.order.updateMany({
          where: {
            paymentId,
            status: OrderStatus.PENDING,
            expiresAt: { gt: new Date() },
          },
          data: {
            status: OrderStatus.PAID,
            expiresAt: null,
          },
        });
        if (updated.count === 0) {
          throw new BadRequestException('Orders already expired');
        }
        return;
      }

      await tx.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.FAILED },
      });

      const allItems = payment.orders.flatMap((o) => o.items);

      const variantIds = [
        ...new Set(
          allItems.map((i) => i.variantId).filter((v): v is string => !!v),
        ),
      ];

      const flashItems = await tx.flashSaleItem.findMany({
        where: {
          variantId: { in: variantIds },
          flashSale: { status: FlashSaleStatus.ACTIVE },
        },
      });

      const flashMap = new Map(flashItems.map((f) => [f.variantId, f]));

      await tx.order.updateMany({
        where: { paymentId },
        data: { status: OrderStatus.CANCELLED },
      });

      for (const item of allItems) {
        if (!item.variantId) continue;

        const flash = flashMap.get(item.variantId);

        if (flash) {
          await tx.flashSaleItem.update({
            where: { id: flash.id, sold: { gte: item.quantity } },
            data: {
              sold: { decrement: item.quantity },
            },
          });
        } else {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }
      }

      if (couponId && buyerId) {
        await this.couponRepo.rollbackUsed(buyerId, couponId, tx);
      }
    });
  }

  async findAllMyOrders(userId: string, data: OrderQueryDto) {
    const where: Prisma.OrderWhereInput = {
      buyerId: userId,
    };

    const result = paginatedResult(
      {
        where,
        page: data.page,
        limit: data.limit,
        orderBy: buildOrderSort(OrderSort.OLDEST),
      },
      (args) => this.orderRepo.listPaginatedOrders(args),
    );

    return result;
  }

  async findShopOrders(userId: string, shopId: string, query: OrderQueryDto) {
    const shop = await this.shopRepo.findUnique({ id: shopId });
    const isOwner = shop?.ownerId === userId;
    if (!isOwner) {
      throw new BadRequestException(`You don't have permission to access.`);
    }

    const where: Prisma.OrderWhereInput = {
      shopId: shop.id,
    };

    const result = paginatedResult(
      {
        where,
        page: query.page,
        limit: query.limit,
        orderBy: buildOrderSort(query.sort),
      },
      (args) => this.orderRepo.listPaginatedOrders(args),
    );

    return result;
  }

  async findAllOrders(query: OrderQueryDto) {
    const where: Prisma.OrderWhereInput = {};

    const result = paginatedResult(
      {
        where,
        page: query.page,
        limit: query.limit,
        orderBy: buildOrderSort(query.sort),
      },
      (args) => this.orderRepo.listPaginatedOrders(args),
    );

    return result;
  }

  async changeOrderStatusByShop(
    userId: string,
    orderCode: string,
    status: OrderStatus,
  ) {
    const order = await this.orderRepo.findUnique({ code: orderCode });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.shop.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to change this order status',
      );
    }

    return this.orderRepo.updateOrder(order.id, status);
  }

  async changeOrderStatusByAdmin(orderId: string, status: OrderStatus) {
    const order = await this.orderRepo.findUnique({ id: orderId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.orderRepo.updateOrder(order.id, status);
  }

  private async loadAndValidateCartItems(userId: string) {
    const cartItems =
      await this.cartItemRepo.getSelectedCartItemsByUser(userId);

    if (!cartItems.length) {
      throw new BadRequestException('Cart items not found');
    }

    const variantIds = cartItems.map((i) => i.variantId);
    const flashItems = await this.prisma.flashSaleItem.findMany({
      where: {
        variantId: { in: variantIds },
        flashSale: { status: FlashSaleStatus.ACTIVE },
      },
    });

    const flashMap = new Map<string, (typeof flashItems)[number]>();
    flashItems.forEach((i) => flashMap.set(i.variantId, i));

    for (const item of cartItems) {
      const flashSale = flashMap.get(item.variantId);
      const availableStock = flashSale
        ? flashSale.quantity - flashSale.sold
        : (item.variant?.stock ?? 0);

      if (item.quantity > availableStock) {
        throw new BadRequestException(`Out of stock: ${item.productName}`);
      }
    }

    return cartItems;
  }

  private async validateCouponAvailability(
    userId: string,
    code: string,
  ): Promise<Coupon> {
    const coupon = await this.couponRepo.findByCode(code);

    if (!coupon || coupon.status !== CouponStatus.ACTIVE) {
      throw new BadRequestException('Invalid coupon');
    }

    const now = new Date();
    if (
      (coupon.startAt && coupon.startAt > now) ||
      (coupon.endAt && coupon.endAt < now)
    ) {
      throw new BadRequestException('Coupon expired');
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    const hasUsed = await this.couponRepo.hasUserUsed(userId, coupon.id);
    if (hasUsed) {
      throw new BadRequestException('Coupon already used');
    }

    return coupon;
  }

  private async decrementStock(
    cartItems: CartItemWithProduct[],
    tx: Prisma.TransactionClient,
  ) {
    const variantIds = cartItems.map((i) => i.variantId);

    const flashItems = await tx.flashSaleItem.findMany({
      where: {
        variantId: { in: variantIds },
        flashSale: { status: FlashSaleStatus.ACTIVE },
      },
    });

    const flashMap = new Map(flashItems.map((f) => [f.variantId, f]));

    for (const item of cartItems) {
      const flash = flashMap.get(item.variantId);

      if (flash) {
        const { count } = await tx.flashSaleItem.updateMany({
          where: {
            id: flash.id,
            sold: { lte: flash.quantity - item.quantity },
          },
          data: {
            sold: { increment: item.quantity },
          },
        });

        if (count === 0) {
          throw new BadRequestException(
            `Flash sale out of stock: ${item.productName}`,
          );
        }
      } else {
        const { count } = await tx.productVariant.updateMany({
          where: {
            id: item.variantId,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        if (count === 0) {
          throw new BadRequestException(`Out of stock: ${item.productName}`);
        }
      }
    }
  }

  private async createOrderTx(
    userId: string,
    shopOrder: CalculatedShopOrder,
    paymentMethod: PaymentMethod,
    address: Address,
    coupon: Coupon | null,
    paymentId: string | null,
    note: string | null,
    tx: Prisma.TransactionClient,
  ) {
    return this.orderRepo.createOrder(
      {
        code: generateOrderCode(),
        buyerId: userId,
        shopId: shopOrder.shopId,
        subtotal: shopOrder.subtotal,
        shippingFee: shopOrder.shippingFee,
        discount: shopOrder.discount,
        totalPrice: shopOrder.total,
        couponId: coupon?.id ?? null,
        paymentId,
        receiverName: address.receiverName,
        receiverPhone: address.receiverPhone,
        addressText: address.addressText,
        paymentMethod,
        note,
        status: OrderStatus.PENDING,
        expiresAt:
          paymentMethod === PaymentMethod.COD
            ? null
            : new Date(Date.now() + ms('15m')),
        items: {
          create: shopOrder.items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            productName: i.productName,
            variantName: i.variantName,
            imageUrl: i.imageUrl,
            price: i.priceSnapshot,
            quantity: i.quantity,
          })),
        },
      },
      tx,
    );
  }
}
