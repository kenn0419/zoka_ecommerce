import { Prisma } from 'generated/prisma';
import { buildSort } from './build-sort.util';
import { ShopSort } from '../enums/shop-sort.enum';

const shopSortMap: Record<ShopSort, Prisma.ShopOrderByWithRelationInput> = {
  [ShopSort.NAME_ASC]: { name: 'asc' },
  [ShopSort.NAME_DESC]: { name: 'desc' },
  [ShopSort.OLDEST]: { createdAt: 'asc' },
  [ShopSort.NEWEST]: { createdAt: 'desc' },
  [ShopSort.RATING_ASC]: { name: 'asc' },
  [ShopSort.RATING_DESC]: { name: 'desc' },
};

export const buildShopSort = (sort?: ShopSort) =>
  buildSort(sort, shopSortMap, { createdAt: 'desc' });
