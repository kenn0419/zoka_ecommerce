import { PrismaClient } from '../generated/prisma';
import { seedCatalog } from './seeds/catalog.seed';
import { seedRBAC } from './seeds/rbac.seed';
import { seedUsers } from './seeds/user.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  await seedRBAC(prisma); // roles, permissions
  await seedUsers(prisma); // admin
  await seedCatalog(prisma); // categories, shops, products

  console.log('🌱 Seeding done!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
