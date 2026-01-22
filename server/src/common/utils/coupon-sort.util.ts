import { Prisma } from 'generated/prisma';
import { CounponSort } from '../enums/coupon-sort.enum';
import { buildSort } from './build-sort.util';

const couponSortMap: Record<
  CounponSort,
  Prisma.CouponOrderByWithRelationInput
> = {
  [CounponSort.START_AT_ASC]: { startAt: 'asc' },
  [CounponSort.START_AT_DESC]: { startAt: 'desc' },
  [CounponSort.END_AT_ASC]: { endAt: 'asc' },
  [CounponSort.END_AT_DESC]: { endAt: 'desc' },
  [CounponSort.OLDEST]: { createdAt: 'asc' },
  [CounponSort.NEWEST]: { createdAt: 'desc' },
  [CounponSort.TYPE_ASC]: { type: 'asc' },
  [CounponSort.TYPE_DESC]: { type: 'desc' },
};

export const buildCouponSort = (sort?: CounponSort) =>
  buildSort(sort, couponSortMap, { createdAt: 'desc' });
