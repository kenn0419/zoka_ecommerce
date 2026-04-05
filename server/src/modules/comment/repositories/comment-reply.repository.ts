import { Injectable } from '@nestjs/common';
import {
  Prisma,
  ProductReviewReplyStatus,
  ProductReviewStatus,
} from '@prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class CommentReplyRepository {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ProductReviewReplyCreateInput) {
    return this.prisma.productReviewReply.create({ data });
  }

  async listPaginatedCommentReplies(params: {
    where: Prisma.ProductReviewReplyWhereInput;
    limit: number;
    page: number;
    orderBy?: Prisma.ProductReviewReplyOrderByWithRelationInput;
  }) {
    const { where, limit, page, orderBy } = params;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.productReviewReply.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.productReviewReply.count({ where }),
    ]);

    return { items, totalItems };
  }

  findRepliesByReviewId(reviewId: string, take: number, cursor?: string) {
    return this.prisma.productReviewReply.findMany({
      where: {
        reviewId,
        status: ProductReviewReplyStatus.ACTIVE,
        review: {
          status: ProductReviewStatus.ACTIVE,
        },
      },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      include: {
        sender: true,
      },
      take,
      orderBy: { createdAt: 'asc' },
    });
  }

  count(reviewId: string) {
    return this.prisma.productReviewReply.count({
      where: {
        reviewId,
        status: ProductReviewReplyStatus.ACTIVE,
        review: { status: ProductReviewStatus.ACTIVE },
      },
    });
  }

  findUnique(where: Prisma.ProductReviewReplyWhereUniqueInput) {
    return this.prisma.productReviewReply.findUnique({
      where,
      include: {
        sender: true,
      },
    });
  }

  update(
    where: Prisma.ProductReviewReplyWhereUniqueInput,
    data: Prisma.ProductReviewReplyUpdateInput,
  ) {
    return this.prisma.productReviewReply.update({
      where,
      data,
    });
  }
}
