import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CouponRepository } from '../repositories/coupon.repository';
import { Coupon, Prisma } from 'generated/prisma';
import { CouponType } from 'src/common/enums/coupon-type.enum';
import { CouponScope } from 'src/common/enums/coupon-scope.enum';
import { CouponStatus } from 'src/common/enums/coupon-status.enum';
import { CounponSort } from 'src/common/enums/coupon-sort.enum';
import { buildSearchOr } from 'src/common/utils/build-search-or.util';
import { paginatedResult } from 'src/common/utils/pagninated-result.util';
import { buildCouponSort } from 'src/common/utils/coupon-sort.util';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { generateCouponCode } from 'src/common/utils/generate-coupon-code.util';
import { CategoryRepository } from 'src/modules/category/category.repository';
import { ProductRepository } from 'src/modules/product/repositories/product.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class AdminCouponService {
  constructor(
    private readonly couponRepo: CouponRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly productRepo: ProductRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: CreateCouponDto) {
    if (data.type === CouponType.PERCENTAGE && data.discount > 100) {
      throw new BadRequestException(
        'Percentage discount cannot be greater than 100',
      );
    }

    if (data.startAt && data.endAt && data.startAt >= data.endAt) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (data.scope === CouponScope.CATEGORY) {
      if (!data.categoryIds || data.categoryIds.length === 0) {
        throw new BadRequestException(
          'Category IDs must be provided for CATEGORY scope',
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
      code,
      description: data.description,
      type: data.type,
      discount: data.discount,
      maxDiscount: data.maxDiscount,
      usageLimit: data.usageLimit,
      scope: CouponScope.GLOBAL,
      status: CouponStatus.INACTIVE,
      shopId: null,
      startAt: data.startAt ? new Date(data.startAt) : undefined,
      endAt: data.endAt ? new Date(data.endAt) : undefined,
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
    search: string,
    page: number,
    limit: number,
    sort: CounponSort,
  ) {
    const where: Prisma.CouponWhereInput = {
      shopId: null,
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

  async findById(id: string) {
    const coupon = await this.couponRepo.findUnique({ id });
    if (!coupon || coupon.scope !== 'GLOBAL')
      throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async activeCounpon(id: string) {
    await this.findById(id);
    return this.couponRepo.update({ id }, { status: CouponStatus.ACTIVE });
  }

  async deactivateCoupon(id: string) {
    await this.findById(id);
    return this.couponRepo.update({ id }, { status: CouponStatus.INACTIVE });
  }

  async updateCoupon(id: string, data: UpdateCouponDto) {
    await this.findById(id);
    let code: string;

    do {
      code = generateCouponCode({
        scope: data.scope,
        type: data.type,
        discount: data.discount,
      });
    } while (await this.couponRepo.findUnique({ code }));
    return this.couponRepo.update({ id }, { ...data, code });
  }
}
