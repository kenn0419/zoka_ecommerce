import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { SlugifyUtil } from '../../src/common/utils/slugify.util';
import { PrismaClient } from '../../generated/prisma';

export async function seedUsers(prisma: PrismaClient) {
  console.log('→ Seeding users...');

  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log('✔ Users already exist, skipping user seeding.');
    return;
  }

  // ==========================================
  // 1. CREATE ADMIN USER
  // ==========================================
  const adminId = crypto.randomUUID();

  const admin = await prisma.user.create({
    data: {
      id: adminId,
      fullName: 'Admin',
      email: 'admin@gmail.com',
      slug: SlugifyUtil.createSlug('admin'),
      phone: '076259919',
      hashedPassword: bcrypt.hashSync('123123az', 10),
      address: '',
      status: 'ACTIVE',
      avatarUrl: faker.image.avatar(),
    },
  });

  // Assign admin role
  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  if (adminRole) {
    await prisma.userRole.create({
      data: {
        userId: admin.id,
        roleId: adminRole.id,
      },
    });
  }

  console.log('✔ Admin user created');

  // ==========================================
  // 2. CREATE 10 FAKE USERS
  // ==========================================
  const userRole = await prisma.role.findUnique({ where: { name: 'user' } });
  const users: {
    id: string;
    fullName: string;
    email: string;
    slug: string;
    phone: string;
    hashedPassword: string;
    address: string;
    status: string;
    avatarUrl: string;
  }[] = [];

  for (let i = 0; i < 10; i++) {
    const fullName = faker.person.fullName();
    const email = faker.internet.email().toLowerCase();
    const phone = faker.phone.number({ style: 'national' });
    const slug = SlugifyUtil.createSlug(fullName);

    const userId = crypto.randomUUID();
    users.push({
      id: userId,
      fullName,
      email,
      slug,
      phone,
      hashedPassword: bcrypt.hashSync('123123az', 10),
      address: faker.location.streetAddress(),
      status: 'ACTIVE',
      avatarUrl: faker.image.avatar(),
    });
  }

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  const createdUsers = await prisma.user.findMany({
    where: {
      slug: { in: users.map((u) => u.slug) },
    },
  });

  for (const user of createdUsers) {
    if (userRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: userRole.id,
        },
      });
    }
  }

  console.log('✔ 10 fake users created with avatars and roles');
  console.log('✅ User seeding completed.');
}
