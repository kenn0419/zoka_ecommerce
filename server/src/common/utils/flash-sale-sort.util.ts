import { Prisma } from '@prisma/client';
import { buildSort } from './build-sort.util';
import { FlashSaleSort } from '../enums/flash-sale.enum';

const flashSaleSortMap: Record<
  FlashSaleSort,
  Prisma.FlashSaleOrderByWithRelationInput
> = {
  [FlashSaleSort.START_TIME_ASC]: { startTime: 'asc' },
  [FlashSaleSort.START_TIME_DESC]: { startTime: 'desc' },
  [FlashSaleSort.END_TIME_ASC]: { endTime: 'asc' },
  [FlashSaleSort.END_TIME_DESC]: { endTime: 'desc' },
  [FlashSaleSort.OLDEST]: { createdAt: 'asc' },
  [FlashSaleSort.NEWEST]: { createdAt: 'desc' },
  [FlashSaleSort.NAME_ASC]: { name: 'asc' },
  [FlashSaleSort.NAME_DESC]: { name: 'desc' },
};

export const buildFlashSaleSort = (sort?: FlashSaleSort) =>
  buildSort(sort, flashSaleSortMap, { createdAt: 'desc' });
