import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto';
import { FlashSaleRepository } from './flash-sale.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { ShopRepository } from '../shop/shop.repository';
import { ProductVariantRepository } from '../product/repositories/product-variant.repository';
import { FlashSaleSort } from 'src/common/enums/flash-sale.enum';
import { FlashSaleStatus, Prisma } from '@prisma/client';
import { paginatedResult } from 'src/common/utils/pagninated-result.util';
import { buildFlashSaleSort } from 'src/common/utils/flash-sale-sort.util';
import { buildSearchOr } from 'src/common/utils/build-search-or.util';
import { FlashSaleQueryDto } from './dto/flash-sale-query.dto';

@Injectable()
export class FlashSaleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly flashSaleRepo: FlashSaleRepository,
    private readonly shopRepo: ShopRepository,
    private readonly productVariantRepo: ProductVariantRepository,
  ) {}

  async create(userId: string, shopId: string, data: CreateFlashSaleDto) {
    const shop = await this.validateShopOwnership(userId, shopId);
    return this.prisma.$transaction(async (tx) => {
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);

      if (startTime >= endTime) {
        throw new BadRequestException('Start time must be before end time.');
      }

      const overlap = await this.flashSaleRepo.checkTimeOverlap(
        shop.id,
        startTime,
        endTime,
        tx,
      );
      if (overlap) {
        throw new BadRequestException(
          'The flash sale time overlaps with an existing flash sale for this shop.',
        );
      }

      const variantSet = new Set<string>();
      for (const item of data.items) {
        if (variantSet.has(item.variantId)) {
          throw new BadRequestException(
            'Duplicate product variant in flash sale items.',
          );
        }
        variantSet.add(item.variantId);
      }

      const variantIds = data.items.map((item) => item.variantId);
      const variants = await this.productVariantRepo.findMany(
        { id: { in: variantIds } },
        tx,
      );
      const variantMap = new Map(variants.map((v) => [v.id, v]));

      for (const item of data.items) {
        if (item.salePrice >= item.originalPrice) {
          throw new BadRequestException(
            'Sale price must be less than original price.',
          );
        }

        const variant = variantMap.get(item.variantId);
        if (!variant) {
          throw new NotFoundException(
            `Product variant with ID ${item.variantId} is not available for flash sale.`,
          );
        }
        if (variant.product.shopId !== shop.id) {
          throw new BadRequestException(
            `Product variant with ID ${item.variantId} does not belong to the shop.`,
          );
        }

        if (item.quantity > variant.stock) {
          throw new BadRequestException(
            `Flash sale quantity for variant ID ${item.variantId} exceeds available stock.`,
          );
        }
      }

      const confict = await this.flashSaleRepo.checkVariantConflict(
        [...variantSet],
        tx,
      );
      if (confict) {
        throw new BadRequestException(
          'One or more product variants are already included in another active or upcoming flash sale.',
        );
      }

      const flashSale = await this.flashSaleRepo.createFlashSale(
        {
          name: data.name,
          startTime,
          endTime,
          maxPerUser: data.maxPerUser,
          shop: { connect: { id: shop.id } },
        },
        tx,
      );

      await this.flashSaleRepo.createItems(
        data.items.map((item) => ({
          flashSaleId: flashSale.id,
          productId: item.productId,
          variantId: item.variantId,
          originalPrice: item.originalPrice,
          salePrice: item.salePrice,
          quantity: item.quantity,
        })),
        tx,
      );

      return await this.flashSaleRepo.findUnique({ id: flashSale.id }, tx);
    });
  }

  async getActiveFlashSales(query: FlashSaleQueryDto) {
    const { search, page, limit, sort } = query;
    const where: Prisma.FlashSaleWhereInput = {
      status: FlashSaleStatus.ACTIVE,
      ...(search && {
        OR: buildSearchOr(search, ['name']),
      }),
    };
    return this.listPaginatedFlashSales(where, page, limit, sort!);
  }

  async getFlashSalesByShop(
    userId: string,
    shopId: string,
    query: FlashSaleQueryDto,
  ) {
    const shop = await this.validateShopOwnership(userId, shopId);
    const { search, page, limit, sort } = query;
    const where: Prisma.FlashSaleWhereInput = {
      shopId: shop.id,
      ...(search && {
        OR: buildSearchOr(search, ['name']),
      }),
    };
    return this.listPaginatedFlashSales(where, page, limit, sort!);
  }

  async getActiveFlashSalesByShop(
    userId: string,
    shopId: string,
    query: FlashSaleQueryDto,
  ) {
    const shop = await this.validateShopOwnership(userId, shopId);
    const { search, page, limit, sort } = query;
    const where: Prisma.FlashSaleWhereInput = {
      shopId: shop.id,
      status: FlashSaleStatus.ACTIVE,
      ...(search && {
        OR: buildSearchOr(search, ['name']),
      }),
    };
    return this.listPaginatedFlashSales(where, page, limit, sort!);
  }

  private async validateShopOwnership(userId: string, shopId: string) {
    const shop = await this.shopRepo.findUnique(
      { id: shopId },
      { ownerId: true },
    );

    if (!shop) {
      throw new NotFoundException('Shop not found.');
    }

    if (shop.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to create a flash sale for this shop.',
      );
    }

    return shop;
  }

  private async listPaginatedFlashSales(
    where: Prisma.FlashSaleWhereInput,
    page: number,
    limit: number,
    sort: FlashSaleSort,
  ) {
    return paginatedResult(
      {
        where,
        page,
        limit,
        orderBy: buildFlashSaleSort(sort),
      },
      (args) => this.flashSaleRepo.listPaginatedFlashSales(args),
    );
  }
}
