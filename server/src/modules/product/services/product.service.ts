import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductRepository } from '../repositories/product.repository';
import { CategoryRepository } from '../../category/category.repository';
import { ShopRepository } from '../../shop/shop.repository';
import { ConfigService } from '@nestjs/config';
import { UploadService } from 'src/infrastructure/upload/upload.service';
import { ProductUploadService } from './product-upload.service';
import {
  Prisma,
  ShopStatus,
  ProductStatus,
  CategoryStatus,
  FlashSaleStatus,
} from '@prisma/client';
import { VariantImageRepository } from '../repositories/variant-image.repository';
import { ProductVariantRepository } from '../repositories/product-variant.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { SlugifyUtil } from 'src/common/utils/slugify.util';
import { buildProductSort } from 'src/common/utils/product-sort.util';
import { buildSearchOr } from 'src/common/utils/build-search-or.util';
import { paginatedResult } from 'src/common/utils/pagninated-result.util';
import { buildProductFilter } from 'src/common/utils/build-product-filter.util';
import { ProductSort } from 'src/common/enums/product.enum';
import { RedisService } from 'src/infrastructure/redis/redis.service';

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
    private redisService: RedisService,
    private productUploadService: ProductUploadService,
  ) {}

  async create(
    userId: string,
    data: CreateProductDto,
    thumbnailFile: Express.Multer.File | null,
    variantFiles: Express.Multer.File[],
  ) {
    if (!thumbnailFile) {
      throw new BadRequestException('Thumbnail is required');
    }

    if (!data.variants?.length) {
      throw new BadRequestException('Product must have at least 1 variant');
    }

    const shop = await this.validateShop(userId, data.shopId);
    const category = await this.validateCategory(data.categoryId);

    const { thumbnail, variantImages } = await this.productUploadService.uploadProductAssets(
      thumbnailFile,
      variantFiles,
    );

    const productId = crypto.randomUUID();

    const variantRows: Prisma.ProductVariantCreateManyInput[] = [];
    const variantImageRows: Prisma.VariantImageCreateManyInput[] = [];

    let minPrice = data.variants[0].price;
    let maxPrice = data.variants[0].price;
    for (const variant of data.variants) {
      const variantId = crypto.randomUUID();
      variantRows.push({
        id: variantId,
        productId,
        name: variant.name,
        stock: variant.stock,
        price: new Prisma.Decimal(variant.price),
      });

      for (const index of variant.images ?? []) {
        if (index < 0 || index >= variantImages.length) {
          throw new BadRequestException('Invalid variant image index');
        }

        variantImageRows.push({
          id: crypto.randomUUID(),
          variantId,
          imageUrl: variantImages[index].url,
        });
      }

      if (minPrice > variant.price) {
        minPrice = variant.price;
      }
      if (maxPrice < variant.price) {
        maxPrice = variant.price;
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await this.productRepo.create(
        {
          id: productId,
          shop: { connect: { id: shop.id } },
          category: { connect: { id: category.id } },
          name: data.name,
          slug: SlugifyUtil.createSlug(data.name),
          description: data.description,
          thumbnail: thumbnail.url,
          minPrice: new Prisma.Decimal(minPrice),
          maxPrice: new Prisma.Decimal(maxPrice),
          status: ProductStatus.PENDING,
        },
        tx,
      );

      await this.productVariantRepo.createMany(tx, variantRows);

      if (variantImageRows.length) {
        await this.variantImageRepo.createMany(tx, variantImageRows);
      }
    });
    
    await this.clearProductListsCaches();

    return { id: productId };
  }

  private async clearProductListsCaches() {
  
    await this.redisService.delByPattern('product:active:*');
    await this.redisService.delByPattern('product:suggest:*');
  }

  async findAllActiveProduct(
    search: string,
    page: number,
    limit: number,
    sort: ProductSort,
    minPrice: number,
    maxPrice: number,
    rating: number,
  ) {
    const cacheKey = `product:active:${search || 'none'}:${page}:${limit}:${sort}:${minPrice}:${maxPrice}:${rating}`;
    
    return this.redisService.getOrSet(
      cacheKey,
      async () => {
        const where: Prisma.ProductWhereInput = {
          status: ProductStatus.ACTIVE,
          category: {
            status: CategoryStatus.ACTIVE,
          },
          ...(search && {
            OR: buildSearchOr(search, ['name', 'description']),
          }),
          ...buildProductFilter({
            minPrice,
            maxPrice,
            rating,
          }),
        };

        return paginatedResult(
          {
            where,
            page,
            limit,
            orderBy: buildProductSort(sort),
          },
          (args) => this.productRepo.listPaginatedForPublic(args),
        );
      },
      60 * 5,
    );
  }

  findSuggestProducts(search: string) {
    if (!search || search.trim().length < 2) {
      return {
        items: [],
        meta: {
          page: 0,
          limit: 0,
          totalItems: 0,
          totalPages: 0,
        },
      };
    }
    
    const cacheKey = `product:suggest:${search}`;
    
    return this.redisService.getOrSet(
      cacheKey,
      async () => {
        const where: Prisma.ProductWhereInput = {
          status: ProductStatus.ACTIVE,
          category: {
            status: CategoryStatus.ACTIVE,
          },
          ...(search && {
            OR: buildSearchOr(search, ['name', 'description']),
          }),
        };

        return paginatedResult(
          {
            where,
            page: 1,
            limit: 4,
            orderBy: buildProductSort(ProductSort.OLDEST),
          },
          (args) => this.productRepo.listPaginatedForPublic(args),
        );
      },
      60 * 5,
    );
  }

  findAllProduct(
    search: string,
    page: number,
    limit: number,
    sort: ProductSort,
    minPrice: number,
    maxPrice: number,
    rating: number,
  ) {
    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: buildSearchOr(search, ['name', 'description']),
      }),
      ...buildProductFilter({
        minPrice,
        maxPrice,
        rating,
      }),
    };

    return paginatedResult(
      {
        where,
        page,
        limit,
        orderBy: buildProductSort(sort),
      },
      (args) => this.productRepo.listPaginated(args),
    );
  }

  async findAllProductByCategory(
    categorySlug: string,
    search: string,
    page: number,
    limit: number,
    sort: ProductSort,
    minPrice: number,
    maxPrice: number,
    rating: number,
  ) {
    const existCategory = await this.categoryRepo.findUnique({
      slug: categorySlug,
    });
    if (!existCategory) {
      throw new NotFoundException('Category not found');
    }

    const where: Prisma.ProductWhereInput = {
      categoryId: existCategory.id,
      ...(search && {
        OR: buildSearchOr(search, ['name', 'description']),
      }),
      ...buildProductFilter({
        minPrice,
        maxPrice,
        rating,
      }),
    };

    return paginatedResult(
      {
        where,
        page,
        limit,
        orderBy: buildProductSort(sort),
      },
      (args) => this.productRepo.listPaginatedForPublic(args),
    );
  }

  async findProductsByShop(
    shopId: string,
    ownerId: string,
    search: string,
    page: number,
    limit: number,
    sort: ProductSort,
  ) {
    const existShop = await this.shopRepo.findUnique({ id: shopId });
    if (!existShop) {
      throw new NotFoundException(`Shop not found`);
    }
    if (existShop?.ownerId !== ownerId) {
      throw new BadRequestException(`You don't have permission to access`);
    }

    const where: Prisma.ProductWhereInput = {
      shopId,
      ...(search && {
        OR: buildSearchOr(search, ['name', 'description']),
      }),
    };

    return paginatedResult(
      {
        where,
        page,
        limit,
        orderBy: buildProductSort(sort),
      },
      (args) => this.productRepo.listPaginatedForPublic(args),
    );
  }

  async findActiveShopProducts(
    shopSlug: string,
    search: string,
    page: number,
    limit: number,
    sort: ProductSort,
  ) {
    const existShop = await this.shopRepo.findUnique({ slug: shopSlug });
    if (!existShop) {
      throw new NotFoundException(`Shop not found`);
    }

    const where: Prisma.ProductWhereInput = {
      shopId: existShop.id,
      status: ProductStatus.ACTIVE,
      ...(search && {
        OR: buildSearchOr(search, ['name', 'description']),
      }),
    };

    return paginatedResult(
      {
        where,
        page,
        limit,
        orderBy: buildProductSort(sort),
      },
      (args) => this.productRepo.listPaginatedForPublic(args),
    );
  }

  async findBySlug(slug: string) {
    const cacheKey = `product:detail:${slug}`;
    
    return this.redisService.getOrSet(
      cacheKey,
      async () => {
        const product = await this.productRepo.findPublicDetail({ slug });
        if (!product) throw new NotFoundException('Product not found');

        if (product.status !== ProductStatus.ACTIVE) {
          throw new BadRequestException('Product is not active');
        }

        const variantIds = product.variants.map((v) => v.id);
        const flashSales = await this.prisma.flashSaleItem.findMany({
          where: {
            variantId: { in: variantIds },
            flashSale: { status: FlashSaleStatus.ACTIVE },
          },
          include: { flashSale: true },
        });
        const sold = await this.prisma.orderItem.aggregate({
          _sum: { quantity: true },
          where: { productId: product.id },
        });
        const flashSaleMap = new Map<string, (typeof flashSales)[number]>();
        flashSales.forEach((item) => flashSaleMap.set(item.variantId, item));

        const variants = product.variants.map((variant) => {
          const flashSale = flashSaleMap.get(variant.id);

          if (!flashSale) {
            return {
              ...variant,
              originalPrice: variant.price,
              displayPrice: variant.price,
              isFlashSale: false,
              flashSaleEndTime: null,
              stock: variant.stock,
              sold: sold._sum.quantity ?? 0,
            };
          }

          return {
            ...variant,
            originalPrice: variant.price,
            displayPrice: flashSale.salePrice,
            isFlashSale: true,
            flashSaleEndTime: flashSale.flashSale.endTime,
            stock: flashSale.quantity - flashSale.sold,
            sold: sold._sum.quantity ?? 0,
          };
        });
        return {
          ...product,
          sold: sold._sum.quantity ?? 0,
          flashSaleEndTime: flashSales[0]?.flashSale?.endTime || null,
          variants,
        };
      },
      60 * 5,
    );
  }

  async findById(id: string) {
    const product = await this.productRepo.findInternalDetail({ id });
    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  update(
    id: string,
    data: UpdateProductDto,
    thumbnailFile?: Express.Multer.File | null,
    variantFiles?: Express.Multer.File[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const existProduct = await this.productRepo.findUnique({ id });
      let thumbnail = existProduct?.thumbnail;

      if (thumbnailFile) {
        thumbnail = (
          await this.productUploadService.uploadSingleFile(thumbnailFile)
        ).url;
      }

    
      if (!data.variants || data.variants.length === 0) {
        await this.productRepo.update(
          { id },
          {
            name: data.name,
            description: data.description,
            thumbnail,
            category: data.categoryId
              ? { connect: { id: data.categoryId } }
              : undefined,
          },
          tx,
        );
        return { productId: existProduct?.id };
      }

      await this.productVariantRepo.deleteByProductId(
        tx,
        existProduct?.id ?? '',
      );
      await this.variantImageRepo.deleteAllByProductId(
        tx,
        existProduct?.id ?? '',
      );
      const variantRows: Prisma.ProductVariantCreateManyInput[] = [];
      const variantImageRows: Prisma.VariantImageCreateManyInput[] = [];

      for (const variant of data.variants) {
        const variantId = crypto.randomUUID();

        /** 1. Tạo variant row */
        variantRows.push({
          id: variantId,
          productId: existProduct?.id ?? '',
          name: variant.name,
          stock: variant.stock,
          price: new Prisma.Decimal(variant.price || 0),
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

            const { url } = await this.productUploadService.uploadSingleFile(file);

            variantImageRows.push({
              id: crypto.randomUUID(),
              variantId,
              imageUrl: url,
            });
          }
        }
      }

    
      await this.productVariantRepo.createMany(tx, variantRows);
      if (variantImageRows.length > 0) {
        await this.variantImageRepo.createMany(tx, variantImageRows);
      }

      /** =======================
       *  UPDATE PRODUCT FINAL
       * ======================= */
      await this.productRepo.update(
        { id },
        {
          name: data.name,
          description: data.description,
          thumbnail,
          category: data.categoryId
            ? { connect: { id: data.categoryId } }
            : undefined,
        },
        tx,
      );

      await this.clearProductListsCaches();
      return { productId: existProduct?.id };
    });
  }

  remove(slug: string) {
    return this.prisma.$transaction(async (tx) => {
      const result = await this.productRepo.remove({ slug }, tx);
      await this.clearProductListsCaches();
      return result;
    });
  }

  private async validateShop(userId: string, shopId: string) {
    const existShop = await this.shopRepo.findUnique({ id: shopId });

    if (!existShop) {
      throw new NotFoundException('Shop not found.');
    }

    if (existShop.ownerId !== userId) {
      throw new BadRequestException('You must be shop owner.');
    }

    if (existShop.status !== ShopStatus.ACTIVE) {
      throw new BadRequestException('Shop is not approved yet.');
    }

    return existShop;
  }

  private async validateCategory(categoryId: string) {
    const category = await this.categoryRepo.findUnique({ id: categoryId });

    if (!category || category.status !== CategoryStatus.ACTIVE)
      throw new BadRequestException('Category is not approved yet');

    return category;
  }

  private buildVariantRows(
    productId: string,
    variants: CreateProductDto['variants'],
    variantImages: { url: string }[],
  ) {
    const variantRows: Prisma.ProductVariantCreateManyInput[] = [];
    const variantImageRows: Prisma.VariantImageCreateManyInput[] = [];

    for (const variant of variants) {
      const variantId = crypto.randomUUID();

      variantRows.push({
        id: variantId,
        productId,
        name: variant.name,
        stock: variant.stock,
        price: new Prisma.Decimal(variant.price),
      });

      for (const i of variant.images ?? []) {
        const image = variantImages[i];
        if (!image) continue;

        variantImageRows.push({
          id: crypto.randomUUID(),
          variantId,
          imageUrl: image.url,
        });
      }
    }

    return { variantRows, variantImageRows };
  }
}
