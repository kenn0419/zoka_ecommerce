import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './repositories/product.repository';
import { CategoryRepository } from '../category/category.repository';
import { ShopRepository } from '../shop/shop.repository';
import { ShopStatus } from 'src/common/enums/shop-status.enum';
import { ConfigService } from '@nestjs/config';
import { UploadService } from 'src/infrastructure/upload/upload.service';
import { Prisma } from 'generated/prisma';
import { CategoryStatus } from 'src/common/enums/category-status.enum';
import { VariantImageRepository } from './repositories/variant-image.repository';
import { ProductVariantRepository } from './repositories/product-variant.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { SlugifyUtil } from 'src/common/utils/slugify.util';
import { ProductStatus } from 'src/common/enums/product-status.enum';
import { ProductSort } from 'src/common/enums/product-sort.enum';
import { buildProductSort } from 'src/common/utils/product-sort.util';
import { buildSearchOr } from 'src/common/utils/build-search-or.util';
import { paginatedQuery } from 'src/common/utils/pagninated-query.util';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private uploadService: UploadService,
    private productRepo: ProductRepository,
    private productVariantRepo: ProductVariantRepository,
    private variantImageRepo: VariantImageRepository,
    private shopRepo: ShopRepository,
    private categoryRepo: CategoryRepository,
  ) {}
  async create(
    userId: string,
    data: CreateProductDto,
    thumbnailFile: Express.Multer.File | null,
    variantFiles: Express.Multer.File[],
  ) {
    const existShop = await this.shopRepo.getShopByOwner(userId);
    if (!existShop || existShop.status !== ShopStatus.ACTIVE) {
      throw new BadRequestException('Shop is not approved yet.');
    }

    const existCategory = await this.categoryRepo.findUnique({
      id: data.categoryId,
    });
    if (!existCategory || existCategory.status !== CategoryStatus.ACTIVE) {
      throw new BadRequestException('Category is not approved yet');
    }

    if (!thumbnailFile) throw new BadRequestException('Thumbnail is required');

    const thumbnailPromise = this.uploadService.uploadFile(
      thumbnailFile,
      this.configService.get<string>('SUPABASE_BUCKET_FOLDER_PRODUCT'),
    );
    const variantUploadPromises = variantFiles.map(
      (file) => this.uploadService.uploadFile(file),
      this.configService.get<string>('SUPABASE_BUCKET_FOLDER_PRODUCT'),
    );

    const [thumbnail, ...variantImages] = await Promise.all([
      thumbnailPromise,
      ...variantUploadPromises,
    ]);

    let totalStock = 0;
    const productId = crypto.randomUUID();
    const variantRows: Prisma.ProductVariantCreateManyInput[] = [];
    const variantImageRows: Prisma.VariantImageCreateManyInput[] = [];

    for (const variant of data.variants) {
      const variantId = crypto.randomUUID();
      totalStock += variant.stock;

      variantRows.push({
        id: variantId,
        productId,
        name: variant.name,
        stock: variant.stock,
        additionalPrice: new Prisma.Decimal(variant.additionalPrice || 0),
      });

      for (const i of variant.images || []) {
        const imageUrl = variantImages[i].url;
        if (!imageUrl) continue;

        variantImageRows.push({
          id: crypto.randomUUID(),
          variantId,
          imageUrl,
        });
      }
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // CREATE PRODUCT
      await this.productRepo.create(tx, {
        id: productId,
        shop: { connect: { id: existShop.id } },
        category: { connect: { id: existCategory.id } },
        name: data.name,
        slug: SlugifyUtil.createSlug(data.name),
        description: data.description,
        price: new Prisma.Decimal(data.price),
        thumbnail: thumbnail.url,
        stock: totalStock,
        status: ProductStatus.PENDING,
      });

      // CREATE MANY VARIANTS
      if (variantRows.length) {
        await this.productVariantRepo.createMany(tx, variantRows);
      }

      // CREATE MANY VARIANT IMAGES
      if (variantImageRows.length) {
        await this.variantImageRepo.createMany(tx, variantImageRows);
      }

      return { id: productId };
    });

    return result;
  }

  async findAllActiveProduct(
    search: string,
    page: number,
    limit: number,
    sort: ProductSort,
  ) {
    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.ACTIVE,
      category: {
        status: CategoryStatus.ACTIVE,
      },
      ...(search && {
        OR: buildSearchOr(search, ['name', 'description']),
      }),
    };

    return paginatedQuery(
      {
        where,
        page,
        limit,
        orderBy: buildProductSort(sort),
      },
      (args) => this.productRepo.listPaginated(args),
    );
  }

  findAllProduct(
    search: string,
    page: number,
    limit: number,
    sort: ProductSort,
  ) {
    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: buildSearchOr(search, ['name', 'description']),
      }),
    };

    return paginatedQuery(
      {
        where,
        page,
        limit,
        orderBy: buildProductSort(sort),
      },
      (args) => this.productRepo.listPaginated(args),
    );
  }

  async findAllProductByCategory(categorySlug: string) {
    const existCategory = await this.categoryRepo.findUnique({
      slug: categorySlug,
    });
    if (!existCategory) {
      throw new NotFoundException('Category not found');
    }

    // const products = await this.productRepo.list(null, {
    //   categoryId: existCategory.id,
    //   status: ProductStatus.ACTIVE,
    // });

    return null;
  }

  findOne(slug: string) {
    return this.productRepo.findUnique(null, { slug });
  }

  update(
    slug: string,
    data: UpdateProductDto,
    thumbnailFile?: Express.Multer.File | null,
    variantFiles?: Express.Multer.File[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const product = await this.productRepo.findUnique(tx, { slug });
      if (!product) throw new NotFoundException('Product not found');
      let thumbnail = product.thumbnail;

      if (thumbnailFile) {
        thumbnail = (
          await this.uploadService.uploadFile(
            thumbnailFile,
            this.configService.get('SUPABASE_BUCKET_FOLDER_PRODUCT'),
          )
        ).url;
      }

      // Case 1 → Không có variants → chỉ update product
      if (!data.variants || data.variants.length === 0) {
        await this.productRepo.update(
          tx,
          { slug },
          {
            name: data.name,
            description: data.description,
            thumbnail,
            price: data.price ? new Prisma.Decimal(data.price) : undefined,
            category: data.categoryId
              ? { connect: { id: data.categoryId } }
              : undefined,
          },
        );
        return { productId: product.id };
      }

      await this.productVariantRepo.deleteByProductId(tx, product.id);
      await this.variantImageRepo.deleteAllByProductId(tx, product.id);

      const variantRows: Prisma.ProductVariantCreateManyInput[] = [];
      const variantImageRows: Prisma.VariantImageCreateManyInput[] = [];

      for (const variant of data.variants) {
        const variantId = crypto.randomUUID();

        /** 1. Tạo variant row */
        variantRows.push({
          id: variantId,
          productId: product.id,
          name: variant.name,
          stock: variant.stock,
          additionalPrice: new Prisma.Decimal(variant.additionalPrice || 0),
        });

        /** 2. Xử lý URL images */
        for (const url of variant.images ?? []) {
          variantImageRows.push({
            id: crypto.randomUUID(),
            variantId,
            imageUrl: url,
          });
        }

        /** 3. Xử lý file images theo index */
        if (variant.images && variantFiles) {
          for (const index of variant.images) {
            const file = variantFiles[index];
            if (!file) continue;

            const { url } = await this.uploadService.uploadFile(
              file,
              this.configService.get('SUPABASE_BUCKET_FOLDER_PRODUCT'),
            );

            variantImageRows.push({
              id: crypto.randomUUID(),
              variantId,
              imageUrl: url,
            });
          }
        }
      }

      // Insert all variants & images
      await this.productVariantRepo.createMany(tx, variantRows);
      if (variantImageRows.length > 0) {
        await this.variantImageRepo.createMany(tx, variantImageRows);
      }

      /** =======================
       *  UPDATE PRODUCT FINAL
       * ======================= */
      await this.productRepo.update(
        tx,
        { slug },
        {
          name: data.name,
          description: data.description,
          thumbnail,
          price: new Prisma.Decimal(data.price ?? 0),
          category: data.categoryId
            ? { connect: { id: data.categoryId } }
            : undefined,
          stock: data.variants.reduce((s, v) => s + v.stock, 0),
        },
      );

      return { productId: product.id };
    });
  }

  remove(slug: string) {
    return this.prisma.$transaction(
      async (tx) => await this.productRepo.remove(tx, { slug }),
    );
  }
}
