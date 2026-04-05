import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    where: Prisma.ProductVariantWhereInput,
    tx: Prisma.TransactionClient | null = this.prisma,
  ) {
    tx = tx !== null ? tx : this.prisma;
    return tx.productVariant.findMany({
      where,
      include: { product: true, images: true },
    });
  }

  deleteByProductId(tx: Prisma.TransactionClient | null, productId: string) {
    tx = tx !== null ? tx : this.prisma;
    return tx.productVariant.deleteMany({ where: { productId } });
  }

  findUnique(
    where: Prisma.ProductVariantWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.productVariant.findUnique({
      where,
      include: { product: true, images: true },
    });
  }
}
