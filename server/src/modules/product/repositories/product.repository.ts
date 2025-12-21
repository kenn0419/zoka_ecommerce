import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { ProductStatus } from 'src/common/enums/product-status.enum';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  create(
    tx: Prisma.TransactionClient | null = this.prisma,
    data: Prisma.ProductCreateInput,
  ) {
    tx = tx !== null ? tx : this.prisma;
    return tx.product.create({ data, include: { shop: true, category: true } });
  }

  update(
    tx: Prisma.TransactionClient | null = this.prisma,
    where: Prisma.ProductWhereUniqueInput,
    data: Prisma.ProductUpdateInput,
  ) {
    tx = tx !== null ? tx : this.prisma;
    return tx.product.update({ where, data });
  }

  findUnique(
    tx: Prisma.TransactionClient | null = this.prisma,
    where: Prisma.ProductWhereUniqueInput,
  ) {
    tx = tx !== null ? tx : this.prisma;
    return tx.product.findUnique({
      where,
      include: {
        category: true,
        shop: true,
        variants: {
          include: {
            images: true,
          },
        },
        reviews: true,
      },
    });
  }

  async listPaginated(params: {
    where: Prisma.ProductWhereInput;
    page: number;
    limit: number;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    const { where, page, limit, orderBy } = params;

    const skip = (page - 1) * limit;

    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          variants: {
            include: {
              images: true,
            },
          },
          category: true,
          shop: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, totalItems };
  }

  remove(
    tx: Prisma.TransactionClient | null = this.prisma,
    where: Prisma.ProductWhereUniqueInput,
  ) {
    tx = tx !== null ? tx : this.prisma;
    return tx.product.update({
      where,
      data: {
        status: ProductStatus.INACTIVE,
      },
    });
  }
}
