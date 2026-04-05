import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class CommentRepository {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ProductReviewUncheckedCreateInput) {
    return this.prisma.productReview.create({
      data,
      select: {
        buyer: true,
        content: true,
        id: true,
        imageUrls: true,
        rating: true,
        variant: true,
        createdAt: true,
      },
    });
  }

  findUnique(where: Prisma.ProductReviewWhereUniqueInput) {
    return this.prisma.productReview.findUnique({
      where,
      include: {
        buyer: true,
        variant: true,
        product: {
          include: { shop: true },
        },
      },
    });
  }

  update(
    where: Prisma.ProductReviewWhereUniqueInput,
    data: Prisma.ProductReviewUpdateInput,
  ) {
    return this.prisma.productReview.update({
      where,
      data,
    });
  }

  countReviewStats(productId: string) {
    return this.prisma.productReview.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });
  }

  async listPaginatedComments(params: {
    where: Prisma.ProductReviewWhereInput;
    limit: number;
    page: number;
    orderBy?: Prisma.ProductReviewOrderByWithRelationInput;
  }) {
    const { where, limit, page, orderBy } = params;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.productReview.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          buyer: true,
          product: true,
          variant: true,
          _count: {
            select: { replies: true },
          },
        },
      }),
      this.prisma.productReview.count({ where }),
    ]);

    return { items, totalItems };
  }
}
