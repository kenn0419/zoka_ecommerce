import { Prisma } from '@prisma/client';
import { buildSort } from './build-sort.util';
import { CommentSort } from '../enums/comment.enum';

const commentSortMap: Record<
  CommentSort,
  Prisma.ProductReviewOrderByWithRelationInput
> = {
  [CommentSort.OLDEST]: { createdAt: 'asc' },
  [CommentSort.NEWEST]: { createdAt: 'desc' },
  [CommentSort.RATING_ASC]: { rating: 'asc' },
  [CommentSort.RATING_DESC]: { rating: 'desc' },
};

export const buildCommentSort = (sort?: CommentSort) =>
  buildSort(sort, commentSortMap, { createdAt: 'desc' });
