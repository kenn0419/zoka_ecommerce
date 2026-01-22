import { BadRequestException, Injectable } from '@nestjs/common';
import { CouponRepository } from '../repositories/coupon.repository';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { CouponType } from 'src/common/enums/coupon-type.enum';
import { ShopRepository } from 'src/modules/shop/shop.repository';
import { CouponScope } from 'src/common/enums/coupon-scope.enum';
import { Prisma } from 'generated/prisma';
import { buildSearchOr } from 'src/common/utils/build-search-or.util';
import { CouponStatus } from 'src/common/enums/coupon-status.enum';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { CounponSort } from 'src/common/enums/coupon-sort.enum';
import { buildCouponSort } from 'src/common/utils/coupon-sort.util';
import { generateCouponCode } from 'src/common/utils/generate-coupon-code.util';
import { ProductRepository } from 'src/modules/product/repositories/product.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { paginatedResult } from 'src/common/utils/pagninated-result.util';
import { CategoryRepository } from 'src/modules/category/category.repository';

@Injectable()
export class ShopCouponService {
  constructor(
    private readonly couponRepo: CouponRepository,
    private readonly shopRepo: ShopRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly productRepo: ProductRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(ownerId: string, shopId: string, data: CreateCouponDto) {
    const shop = await this.shopRepo.findUnique({ id: shopId });
    if (!shop || shop.ownerId !== ownerId) {
      throw new BadRequestException('Shop not found or access denied');
    }
    if (data.type === CouponType.PERCENTAGE && data.discount > 100) {
      throw new BadRequestException(
        'Percentage discount cannot be greater than 100',
      );
    }

    if (data.scope === CouponScope.CATEGORY) {
      if (!data.categoryIds || data.categoryIds.length === 0) {
        throw new BadRequestException(
          'Category IDs must be provided for CATEGORY scope coupons',
        );
      }

      const count = await this.categoryRepo.count({
        id: { in: data.categoryIds },
      });
      if (count !== data.categoryIds.length) {
        throw new BadRequestException(
          'Some categories do not belong to this shop',
        );
      }
    }

    if (data.scope === CouponScope.PRODUCT) {
      if (!data.productIds || data.productIds.length === 0) {
        throw new BadRequestException(
          'Product IDs must be provided for PRODUCT scope coupons',
        );
      }

      const count = await this.productRepo.count({
        id: { in: data.productIds },
        shopId: shop.id,
      });
      if (count !== data.productIds.length) {
        throw new BadRequestException(
          'Some products do not belong to this shop',
        );
      }
    }

    let code: string;

    do {
      code = generateCouponCode({
        scope: data.scope,
        type: data.type,
        discount: data.discount,
      });
    } while (await this.couponRepo.findUnique({ code }));

    const payload = {
      ...data,
      code,
      shopId: shop.id,
      startAt: data.startAt ? new Date(data.startAt) : undefined,
      endAt: data.endAt ? new Date(data.endAt) : undefined,
      status: CouponStatus.INACTIVE,
    };

    return await this.prisma.$transaction(async (tx) => {
      const coupon = await tx.coupon.create({ data: payload });

      if (data.scope === CouponScope.PRODUCT) {
        await tx.couponProduct.createMany({
          data: data.productIds!.map((productId) => ({
            couponId: coupon.id,
            productId,
          })),
        });
      }

      if (data.scope === CouponScope.CATEGORY) {
        await tx.couponCategory.createMany({
          data: data.categoryIds!.map((categoryId) => ({
            couponId: coupon.id,
            categoryId,
          })),
        });
      }

      return coupon;
    });
  }

  async findAll(
    ownerId: string,
    shopId: string,
    search: string,
    page: number,
    limit: number,
    sort: CounponSort,
  ) {
    const shop = await this.shopRepo.findUnique({ id: shopId });
    if (!shop || shop.ownerId !== ownerId) {
      throw new BadRequestException('Shop not found or access denied');
    }

    const where: Prisma.CouponWhereInput = {
      shopId: shop.id,
      ...(search && {
        OR: buildSearchOr(search, ['code', 'description']),
      }),
    };

    return paginatedResult(
      {
        where,
        page,
        limit,
        orderBy: buildCouponSort(sort),
      },
      (args) => this.couponRepo.listPaginatedCoupons(args),
    );
  }

  async findById(ownerId: string, shopId: string, couponId: string) {
    const shop = await this.shopRepo.findUnique({ id: shopId });
    if (!shop || shop.ownerId !== ownerId) {
      throw new BadRequestException('Shop not found or access denied');
    }
    const coupon = await this.couponRepo.findUnique({ id: couponId });
    if (!coupon || coupon.shopId !== shop.id) {
      throw new BadRequestException('Coupon not found or access denied');
    }
    return coupon;
  }

  async activeCoupon(ownerId: string, shopId: string, couponId: string) {
    await this.findById(ownerId, shopId, couponId);
    return this.couponRepo.update(
      { id: couponId },
      { status: CouponStatus.ACTIVE },
    );
  }

  async deactivateCoupon(ownerId: string, shopId: string, couponId: string) {
    await this.findById(ownerId, shopId, couponId);
    return this.couponRepo.update(
      { id: couponId },
      { status: CouponStatus.INACTIVE },
    );
  }

  async updateCoupon(
    ownerId: string,
    shopId: string,
    couponId: string,
    data: UpdateCouponDto,
  ) {
    await this.findById(ownerId, shopId, couponId);
    let code: string;

    do {
      code = generateCouponCode({
        scope: data.scope,
        type: data.type,
        discount: data.discount,
      });
    } while (await this.couponRepo.findUnique({ code }));
    return this.couponRepo.update({ id: couponId }, { ...data, code });
  }
}
