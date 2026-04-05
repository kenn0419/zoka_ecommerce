import { PrismaClient } from '@prisma/client';
import { seedCatalog } from './seeds/catalog.seed';
import { seedOrders } from './seeds/order.seed';
import { seedProductReviews, updateProductRating } from './seeds/product-review.seed';
import { seedRBAC } from './seeds/rbac.seed';
import { seedUsers } from './seeds/user.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  await seedRBAC(prisma); 
  await seedUsers(prisma); 
  await seedCatalog(prisma);
  await seedOrders(prisma);
  await seedProductReviews(prisma);
  await updateProductRating(prisma);

  console.log('🌱 Seeding done!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
