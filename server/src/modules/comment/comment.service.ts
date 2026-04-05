import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentRepository } from './repositories/comment.repository';
import { OrderItemRepository } from '../order/repositories/order-item.repository';
import { OrderStatus } from 'src/common/enums/order.enum';
import { UploadService } from 'src/infrastructure/upload/upload.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Prisma, ProductReviewStatus } from '@prisma/client';
import { ProductRepository } from '../product/repositories/product.repository';
import { ShopRepository } from '../shop/shop.repository';
import { CommentQueryDto } from './dto/comment-query.dto';
import { paginatedResult } from 'src/common/utils/pagninated-result.util';
import { buildCommentSort } from 'src/common/utils/comment-sort.util';
import { CommentReplyRepository } from './repositories/comment-reply.repository';
import { CommentReplyStatus } from 'src/common/enums/comment.enum';
import { CursorPaginatedQueryDto } from 'src/common/dto/paginated-query.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly uploadService: UploadService,
    private readonly commentRepo: CommentRepository,
    private readonly commentReplyRepo: CommentReplyRepository,
    private readonly productRepo: ProductRepository,
    private readonly shopRepo: ShopRepository,
    private readonly orderItemRepo: OrderItemRepository,
  ) {}

  async createComment(
    userId: string,
    data: CreateCommentDto,
    images?: Express.Multer.File[],
  ) {
    const orderItem = await this.validateComment(data.orderItemId, userId);

    const existingComment = await this.commentRepo.findUnique({
      orderItemId: data.orderItemId,
    });
    if (existingComment) {
      throw new BadRequestException(
        'You have already commented on this order item',
      );
    }
    let imageUrls: string[] = [];
    if (images && images.length > 0) {
      const folder = this.configService.get<string>(
        'SUPABASE_BUCKET_FOLDER_COMMENT',
      );
      imageUrls = await Promise.all(
        images.map(
          async (image) =>
            (await this.uploadService.uploadFile(image, folder)).url,
        ),
      );
    }

    const payload: Prisma.ProductReviewUncheckedCreateInput = {
      rating: data.rating,
      content: data.content,
      imageUrls,
      productId: orderItem.productId,
      variantId: orderItem.variantId,
      orderItemId: orderItem.id,
      buyerId: userId,
    };

    const review = await this.commentRepo.create(payload);

    await this.updateProductRating(orderItem.productId);
    return review;
  }

  async findAllReviewsWithProduct(productSlug: string, query: CommentQueryDto) {
    const product = await this.productRepo.findUnique({ slug: productSlug });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const where: Prisma.ProductReviewWhereInput = {
      productId: product.id,
      status: ProductReviewStatus.ACTIVE,
      ...(query.rating ? { rating: query.rating } : {}),
    };

    const result = paginatedResult(
      {
        where,
        limit: query.limit,
        page: query.page,
        orderBy: buildCommentSort(query.sort),
      },
      (args) => this.commentRepo.listPaginatedComments(args),
    );

    return result;
  }
  
  async findAllForAdmin(query: CommentQueryDto) {
    const where: Prisma.ProductReviewWhereInput = {
      ...(query.rating ? { rating: query.rating } : {}),
    };

    return paginatedResult(
      {
        where,
        limit: query.limit,
        page: query.page,
        orderBy: buildCommentSort(query.sort),
      },
      (args) => this.commentRepo.listPaginatedComments(args),
    );
  }

  async findAllForShop(userId: string, shopId: string, query: CommentQueryDto) {
    const shop = await this.shopRepo.findUnique({ id: shopId });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
    if (shop.ownerId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to view reviews for this shop',
      );
    }

    const where: Prisma.ProductReviewWhereInput = {
      product: { shopId },
      ...(query.rating ? { rating: query.rating } : {}),
    };

    return paginatedResult(
      {
        where,
        limit: query.limit,
        page: query.page,
        orderBy: buildCommentSort(query.sort),
      },
      (args) => this.commentRepo.listPaginatedComments(args),
    );
  }

  async findAllReplies(reviewId: string, query: CursorPaginatedQueryDto) {
    const take = query.limit + 1;

    const items = await this.commentReplyRepo.findRepliesByReviewId(
      reviewId,
      take,
      query.cursor,
    );

    const hasNextPage = items.length > query.limit;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;
    return {
      items,
      meta: {
        nextCursor,
        hasMore: hasNextPage,
      },
    };
  }

  async canReview(userId: string, productId: string) {
    const orderItem = await this.orderItemRepo.findCompletedUnreviewedByProduct(
      userId,
      productId,
    );
    if (!orderItem) {
      return { canReview: false };
    }
    return { canReview: true, orderItemId: orderItem.id };
  }

  async replyComment(userId: string, reviewId: string, content: string) {
    const review = await this.commentRepo.findUnique({ id: reviewId });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const isShop = review.product.shop.ownerId === userId;

    const hasBought = await this.orderItemRepo.hasUserBoughtProduct(
      userId,
      review.productId,
    );

    if (!isShop && !hasBought) {
      throw new ForbiddenException(
        'You are not allowed to reply to this comment',
      );
    }

    return this.commentReplyRepo.create({
      review: { connect: { id: reviewId } },
      sender: { connect: { id: userId } },
      content,
    });
  }

  async updateComment(
    userId: string,
    reviewId: string,
    data: UpdateCommentDto,
  ) {
    const review = await this.commentRepo.findUnique({ id: reviewId });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.buyerId !== userId) {
      throw new ForbiddenException('You are not allowed to update this review');
    }
    const updatedReview = await this.commentRepo.update({ id: reviewId }, data);
    await this.updateProductRating(updatedReview.productId);
    return updatedReview;
  }

  async deleteComment(userId: string, reviewId: string) {
    const review = await this.commentRepo.findUnique({ id: reviewId });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.buyerId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this review');
    }
    const updated = this.commentRepo.update(
      { id: reviewId },
      { status: ProductReviewStatus.INACTIVE },
    );

    await this.updateProductRating(review.productId);
    return updated;
  }

  async updateReply(userId: string, replyId: string, content: string) {
    const reply = await this.commentReplyRepo.findUnique({ id: replyId });
    if (!reply) {
      throw new NotFoundException('Reply not found');
    }
    if (reply.senderId !== userId) {
      throw new ForbiddenException('You are not allowed to update this reply');
    }
    return this.commentReplyRepo.update({ id: replyId }, { content });
  }

  async deleteReply(userId: string, replyId: string) {
    const reply = await this.commentReplyRepo.findUnique({ id: replyId });
    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    const review = await this.commentRepo.findUnique({ id: reply.reviewId });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const isOwnerReply = reply.senderId === userId;
    const isShopOwner = review.product.shop.ownerId === userId;

    if (!isOwnerReply && !isShopOwner) {
      throw new ForbiddenException('You are not allowed to delete this reply');
    }

    return this.commentReplyRepo.update(
      { id: replyId },
      { status: CommentReplyStatus.INACTIVE },
    );
  }

  private async updateProductRating(productId: string) {
    const stats = await this.commentRepo.countReviewStats(productId);

    await this.productRepo.update(
      { id: productId },
      {
        avgRating: stats._avg.rating ?? 0,
        reviewCount: stats._count.rating ?? 0,
      },
    );
  }

  private async validateComment(orderItemId: string, userId: string) {
    const orderItem = await this.orderItemRepo.findUnique({
      id: orderItemId,
    });

    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }

    if (orderItem.order.buyerId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to comment on this order item',
      );
    }

    if (orderItem.order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('Order item is not completed yet');
    }

    return orderItem;
  }
}
