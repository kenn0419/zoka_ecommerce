import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Thay đổi tên file json nếu bạn đặt tên khác
const JSON_FILE_PATH = path.join(__dirname, 'shopee_product.json');

async function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-6);
}

async function seedToDb(productData: any, shopData: any) {
  if (!productData) return;

  console.log(`\n⏳ Đang cài cắm dữ liệu cho sản phẩm: ${productData.name}...`);

  // 1. Phân loại danh mục
  let category = await prisma.category.findFirst();
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Thời trang & Phụ kiện',
        slug: 'thoi-trang-phu-kien',
        thumbnailUrl: 'https://via.placeholder.com/150',
        status: 'ACTIVE'
      }
    });
  }

  // 2. Tạo User Seller và Shop
  const shopName = shopData?.name || `Shop Shopee ${productData.shopid}`;
  let shop = await prisma.shop.findFirst({ where: { name: shopName } });
  
  if (!shop) {
    const slugOwner = await slugify(shopName + ' owner');
    const owner = await prisma.user.create({
      data: {
        email: `owner_${productData.shopid}@shopee.vn`,
        hashedPassword: 'hashed_password_mock',
        fullName: shopName,
        phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
        slug: slugOwner,
        status: 'ACTIVE',
        birthday: faker.date.birthdate()
      }
    });

    const slugShop = await slugify(shopName);
    shop = await prisma.shop.create({
      data: {
        name: shopName,
        slug: slugShop,
        ownerId: owner.id,
        description: `Imported from Shopee Shop ID ${productData.shopid}`,
        status: 'ACTIVE'
      }
    });
    console.log(`[+] Đã tạo Shop: ${shop.name}`);
  }

  // 3. Tạo Product
  const productSlug = await slugify(productData.name);
  
  // Tính min max price
  const priceDivider = 100000;
  let minPrice = 0;
  let maxPrice = 0;
  
  if (productData.price_min && productData.price_max) {
      minPrice = productData.price_min / priceDivider;
      maxPrice = productData.price_max / priceDivider;
  } else if (productData.price) {
      minPrice = productData.price / priceDivider;
      maxPrice = productData.price / priceDivider;
  }

  const product = await prisma.product.create({
    data: {
      name: productData.name,
      slug: productSlug,
      description: productData.description || 'Sản phẩm siêu xịn từ Shopee',
      thumbnail: productData.image ? `https://down-vn.img.susercontent.com/file/${productData.image}` : 'https://via.placeholder.com/150',
      minPrice,
      maxPrice,
      shopId: shop.id,
      categoryId: category.id,
      status: 'ACTIVE',
      hasStock: true
    }
  });
  console.log(`[+] Đã tạo Product: ${product.name}`);

  // 4. Lấy Variants (mẫu mã, kích thước)
  const models = productData.models || productData.tier_variations;
  if (models && models.length > 0) {
    for (const model of models) {
      // Shopee tier_variations or models
      const variantName = model.name || 'Phân loại';
      const variantPrice = model.price ? (model.price / priceDivider) : minPrice;
      const stock = model.stock || model.normal_stock || 100;
      
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: variantName,
          price: variantPrice,
          stock: stock
        }
      });
    }
    console.log(`[+] Đã lưu ${models.length} Variants cho Product.`);
  } else {
    // Không có variant thiết lập chung 1 cái
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: 'Mặc định',
        price: minPrice,
        stock: productData.stock || 100
      }
    });
  }

  console.log('✅ Chèn dữ liệu hoàn tất.\n');
}

async function main() {
  console.log("🚀 Bắt đầu Shopee Seeder (Local File)...");
  
  if (!fs.existsSync(JSON_FILE_PATH)) {
      console.error(`[-] Tệp JSON không tồn tại ở: ${JSON_FILE_PATH}`);
      console.error(`Vui lòng lưu nội dung JSON từ Network tab URL sản phẩm Shopee thành file (vd: shopee_product.json)`);
      return;
  }

  const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
  try {
      const parsedData = JSON.parse(fileContent);
      // Trên Shopee, Payload thường nằm trong parsedData.data hoặc parsedData.item
      const productData = parsedData.data || parsedData.item || parsedData;
      
      // Ở file này Shop Data có thể không có nếu chỉ curl api GetItem, dùng dữ liệu giả.
      const shopData = { name: productData.shop_name || `Shop_${productData.shopid}` };
      
      await seedToDb(productData, shopData);
  } catch (err) {
      console.error("[-] File JSON bị lỗi syntax:", err);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🎉 Hoàn tất quá trình Seed data Shopee.");
  });
