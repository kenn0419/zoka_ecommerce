import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class ProductVariantRepository {
  constructor(private prisma: PrismaService) {}

  create(
    tx: Prisma.TransactionClient | null = this.prisma,
    data: Prisma.ProductVariantCreateInput,
  ) {
    tx = tx !== null ? tx : this.prisma;
    return tx.productVariant.create({ data });
  }

  createMany(
    tx: Prisma.TransactionClient | null = this.prisma,
    data: Prisma.ProductVariantCreateManyInput[],
  ) {
    tx = tx !== null ? tx : this.prisma;
    return tx.productVariant.createMany({ data });
  }

  findMany(
    tx: Prisma.TransactionClient | null = this.prisma,
    where: Prisma.ProductVariantWhereInput,
  ) {
    tx = tx !== null ? tx : this.prisma;
    return tx.productVariant.deleteMany({ where });
  }

  deleteByProductId(tx: Prisma.TransactionClient | null, productId: string) {
    tx = tx !== null ? tx : this.prisma;
    return tx.productVariant.deleteMany({ where: { productId } });
  }
}
