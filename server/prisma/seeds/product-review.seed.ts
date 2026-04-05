import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export async function seedProductReviews(prisma: PrismaClient) {
  console.log('🌱 Seeding Product Reviews...');

  const orderItems = await prisma.orderItem.findMany({
    include: {
      order: true,
      product: true,
    },
  });

  if (orderItems.length === 0) {
    console.log('⚠ No order items found. Seed orders first!');
    return;
  }

  for (const item of orderItems) {
    // random 50% order item sẽ có review
    if (Math.random() > 0.5) continue;

    const rating = faker.number.int({ min: 3, max: 5 });

    try {
      await prisma.productReview.create({
        data: {
          productId: item.productId,
          buyerId: item.order.buyerId,
          variantId: item.variantId ?? undefined,
          orderItemId: item.id,
          rating,
          content: faker.lorem.sentences(2),
          imageUrls: [
            faker.image.urlPicsumPhotos(),
            faker.image.urlPicsumPhotos(),
          ],
        },
      });
    } catch (err) {
      // nếu đã tồn tại review thì bỏ qua
    }
  }

  console.log('✔ Product reviews inserted!');
}

export async function updateProductRating(prisma: PrismaClient) {
  console.log('🔄 Updating product rating...');

  const products = await prisma.product.findMany({
    include: {
      reviews: true,
    },
  });

  for (const product of products) {
    if (product.reviews.length === 0) continue;

    const total = product.reviews.reduce(
      (sum, r) => sum + r.rating,
      0,
    );

    const avg = total / product.reviews.length;

    await prisma.product.update({
      where: { id: product.id },
      data: {
        avgRating: avg,
        reviewCount: product.reviews.length,
      },
    });
  }

  console.log('✔ Product rating updated!');
}