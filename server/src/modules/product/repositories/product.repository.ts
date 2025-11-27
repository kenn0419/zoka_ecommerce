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

  list(tx: Prisma.TransactionClient | null, where: Prisma.ProductWhereInput) {
    tx = tx !== null ? tx : this.prisma;
    return tx.product.findMany({
      where,
      include: {
        variants: true,
      },
    });
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
