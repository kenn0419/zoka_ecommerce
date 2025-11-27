import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class VariantImageRepository {
  constructor(private prisma: PrismaService) {}

  createMany(
    tx: Prisma.TransactionClient | null = this.prisma,
    data: Prisma.VariantImageCreateManyInput[],
  ) {
    tx = tx !== null ? tx : this.prisma;
    return tx.variantImage.createMany({ data });
  }

  deleteByVariantIds(tx: Prisma.TransactionClient | null, ids: string[]) {
    tx = tx !== null ? tx : this.prisma;
    return tx.variantImage.deleteMany({
      where: { variantId: { in: ids } },
    });
  }

  async deleteAllByProductId(
    tx: Prisma.TransactionClient | null,
    productId: string,
  ): Promise<Prisma.BatchPayload> {
    tx = tx !== null ? tx : this.prisma;
    return tx.variantImage.deleteMany({
      where: {
        variant: {
          productId: productId,
        },
      },
    });
  }
}
