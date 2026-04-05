import { Prisma } from '@prisma/client';
import { buildSort } from './build-sort.util';
import { OrderSort } from '../enums/order.enum';

const orderSortMap: Record<OrderSort, Prisma.OrderOrderByWithRelationInput> = {
  [OrderSort.OLDEST]: { createdAt: 'asc' },
  [OrderSort.NEWEST]: { createdAt: 'desc' },
  [OrderSort.PAID_AT_ASC]: { paidAt: 'desc' },
  [OrderSort.PAID_AT_DESC]: { paidAt: 'desc' },
  [OrderSort.TOTAL_PRICE_ASC]: { totalPrice: 'asc' },
  [OrderSort.TOTAL_PRICE_DESC]: { totalPrice: 'desc' },
};

export const buildOrderSort = (sort?: OrderSort) =>
  buildSort(sort, orderSortMap, { createdAt: 'desc' });
