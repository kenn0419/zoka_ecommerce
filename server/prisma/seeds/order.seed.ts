import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedOrders(prisma: PrismaClient) {
  console.log('🌱 Seeding Orders...');

  const users = await prisma.user.findMany();
  const shops = await prisma.shop.findMany({
    include: {
      products: {
        include: {
          variants: true,
        },
      },
    },
  });

  for (let i = 0; i < 20; i++) {
    const buyer = faker.helpers.arrayElement(users);
    const shop = faker.helpers.arrayElement(shops);

    if (shop.products.length === 0) continue;

    const order = await prisma.order.create({
      data: {
        code: `ORD-${faker.string.alphanumeric(8).toUpperCase()}`,
        buyerId: buyer.id,
        shopId: shop.id,
        receiverName: buyer.fullName,
        receiverPhone: buyer.phone,
        addressText: faker.location.streetAddress(),
        subtotal: 0,
        shippingFee: 30000,
        totalPrice: 0,
        status: faker.helpers.arrayElement([
          'PENDING',
          'PAID',
          'PROCESSING',
          'SHIPPED',
          'COMPLETED',
        ]),
        paymentMethod: faker.helpers.arrayElement([
          'COD',
          'MOMO',
          'VNPAY',
        ]),
      },
    });

    let subtotal = 0;

    const product = faker.helpers.arrayElement(shop.products);
    const variant = faker.helpers.arrayElement(product.variants);

    const quantity = faker.number.int({ min: 1, max: 3 });

    const price = Number(variant.price);

    subtotal += price * quantity;

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        variantName: variant.name,
        imageUrl: product.thumbnail,
        quantity,
        price,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        subtotal,
        totalPrice: subtotal + 30000,
      },
    });
  }

  console.log('✔ Orders inserted!');
}