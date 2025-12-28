// fake-data-generator.ts
import fs from 'fs';
import { faker } from '@faker-js/faker';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  description: string;
  thumbnailUrl: string;
  status: string;
}

interface Shop {
  id: string;
  name: string;
  logoUrl: string;
  sector: string;
}

interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
}

interface Product {
  id: string;
  shopId: string;
  categoryId: string;
  name: string;
  thumbnail: string;
  minPrice: number;
  maxPrice: number;
  images: string[];
  variants: ProductVariant[];
}

const sectors = ['phones', 'shoes', 'clothes', 'home', 'accessories', 'sports'];
const shopsPerSector = 4;
const productsPerShop = 12;

const categories: Category[] = [];
const shops: Shop[] = [];
const products: Product[] = [];

// Helper: generate image URL
function generateImageUrl(seed: string, width = 640, height = 480) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

// =================== CATEGORIES ===================
for (const sector of sectors) {
  const rootCatId = crypto.randomUUID();
  categories.push({
    id: rootCatId,
    name: sector.charAt(0).toUpperCase() + sector.slice(1),
    slug: sector.toLowerCase(),
    description: `Category for ${sector}`,
    thumbnailUrl: generateImageUrl(`category-${sector}`),
    status: 'ACTIVE',
  });

  // Sub-categories level 1
  const subCount1 = faker.number.int({ min: 2, max: 3 });
  for (let i = 0; i < subCount1; i++) {
    const subCat1Id = crypto.randomUUID();
    categories.push({
      id: subCat1Id,
      name: faker.commerce.department(),
      slug: faker.helpers.slugify(faker.commerce.department()),
      parentId: rootCatId,
      description: faker.commerce.productDescription(),
      thumbnailUrl: generateImageUrl(`category-${subCat1Id}`),
      status: 'ACTIVE',
    });

    // Sub-categories level 2
    const subCount2 = faker.number.int({ min: 2, max: 3 });
    for (let j = 0; j < subCount2; j++) {
      const subCat2Id = crypto.randomUUID();
      categories.push({
        id: subCat2Id,
        name: faker.commerce.productAdjective(),
        slug: faker.helpers.slugify(faker.commerce.productAdjective()),
        parentId: subCat1Id,
        description: faker.commerce.productDescription(),
        thumbnailUrl: generateImageUrl(`category-${subCat2Id}`),
        status: 'ACTIVE',
      });
    }
  }
}

// =================== SHOPS & PRODUCTS ===================
for (const sector of sectors) {
  for (let s = 0; s < shopsPerSector; s++) {
    const shopId = crypto.randomUUID();
    const shopName = `${faker.company.name()} ${faker.company.catchPhrase()}`;
    shops.push({
      id: shopId,
      name: shopName,
      logoUrl: generateImageUrl(`shop-logo-${shopName}`, 200, 200),
      sector,
    });

    // Tạo products
    for (let p = 0; p < productsPerShop; p++) {
      const productId = crypto.randomUUID();
      const productName = faker.commerce.productName();

      // Chọn category random từ sector
      const sectorCategories = categories.filter((c) => {
        let root = c;
        while (root.parentId) {
          root = categories.find((cat) => cat.id === root.parentId)!;
        }
        return root.slug === sector;
      });
      const categoryId = faker.helpers.arrayElement(sectorCategories).id;

      // Tạo variants
      const variantCount = faker.number.int({ min: 1, max: 3 });
      const variants: ProductVariant[] = [];
      for (let v = 0; v < variantCount; v++) {
        const variantId = crypto.randomUUID();
        variants.push({
          id: variantId,
          productId,
          name: `${productName} ${faker.color.human()}`,
          price: parseFloat(
            faker.commerce.price({ min: 10000, max: 10000000, dec: 2 }),
          ),
          stock: faker.number.int({ min: 0, max: 50 }),
          images: Array.from({ length: 3 }, (_, i) =>
            generateImageUrl(`variant-${variantId}-${i}`, 640, 480),
          ),
        });
      }

      let minPrice = Math.min(...variants.map((v) => v.price));
      let maxPrice = Math.max(...variants.map((v) => v.price));

      products.push({
        id: productId,
        shopId,
        categoryId,
        name: productName,
        thumbnail: variants[0].images[0],
        minPrice,
        maxPrice,
        images: variants.flatMap((v) => v.images),
        variants,
      });
    }
  }
}

// =================== EXPORT JSON ===================
fs.writeFileSync('categories.json', JSON.stringify(categories, null, 2));
fs.writeFileSync('shops.json', JSON.stringify(shops, null, 2));
fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

console.log('Done! Generated categories.json, shops.json, products.json');
