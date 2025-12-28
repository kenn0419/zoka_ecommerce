import fs from 'fs';
import { SlugifyUtil } from '../../src/common/utils/slugify.util';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '../../generated/prisma';

export async function seedCatalog(prisma: PrismaClient) {
  console.log('🌱 Seeding Categories/Shops/Products...');

  const shops = JSON.parse(fs.readFileSync('shops.json', 'utf-8'));
  const products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));
  const categoriesData = JSON.parse(
    fs.readFileSync('categories.json', 'utf-8'),
  );

  // ========== Lấy danh sách userId ==========
  const users = await prisma.user.findMany();
  const userIds = users.map((u) => u.id);

  // ========== LẤY ROLE SHOP ==========
  const shopRole = await prisma.role.findUnique({ where: { name: 'shop' } });

  // ========== CATEGORIES ==========
  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const category = await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        slug: SlugifyUtil.createSlug(cat.name),
        thumbnailUrl: cat.thumbnailUrl,
        status: cat.status,
        parent: cat.parentId ? { connect: { id: cat.parentId } } : undefined,
      },
    });
    categoryMap[cat.id] = category.id;
  }
  console.log('✔ Categories inserted!');

  // ========== SHOPS ==========
  const shopMap: Record<string, string> = {};

  for (const shop of shops) {
    // Chọn ownerId random từ danh sách userIds
    const ownerId = faker.helpers.arrayElement(userIds);

    const newShop = await prisma.shop.create({
      data: {
        id: shop.id,
        name: shop.name,
        slug: SlugifyUtil.createSlug(shop.name),
        description: shop.description,
        logoUrl: shop.logoUrl,
        status: 'ACTIVE',
        ownerId,
      },
    });

    shopMap[shop.id] = newShop.id;

    // Gán role "shop" cho owner nếu chưa có
    if (shopRole) {
      const exists = await prisma.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: ownerId,
            roleId: shopRole.id,
          },
        },
      });

      if (!exists) {
        await prisma.userRole.create({
          data: {
            userId: ownerId,
            roleId: shopRole.id,
          },
        });
      }
    }
  }
  console.log('✔ Shops inserted with owner roles!');

  // ========== PRODUCTS ==========
  for (const product of products) {
    const newProduct = await prisma.product.create({
      data: {
        id: product.id,
        shopId: shopMap[product.shopId],
        categoryId: categoryMap[product.categoryId],
        name: product.name,
        slug: SlugifyUtil.createSlug(product.name),
        thumbnail: product.thumbnail,
        status: 'ACTIVE',
        minPrice: product.minPrice,
        maxPrice: product.maxPrice,
      },
    });

    // --- Variants ---
    for (const variant of product.variants) {
      const newVariant = await prisma.productVariant.create({
        data: {
          id: variant.id,
          productId: newProduct.id,
          name: variant.name,
          stock: variant.stock,
          price: variant.price,
        },
      });

      // Images
      for (const img of variant.images) {
        await prisma.variantImage.create({
          data: {
            variantId: newVariant.id,
            imageUrl: img,
          },
        });
      }
    }
  }

  console.log('✔ Products, variants, images inserted!');
}
