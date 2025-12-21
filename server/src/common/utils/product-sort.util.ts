import { Prisma } from 'generated/prisma';
import { ProductSort } from '../enums/product-sort.enum';
import { buildSort } from './build-sort.util';

const productSortMap: Record<
  ProductSort,
  Prisma.ProductOrderByWithRelationInput
> = {
  [ProductSort.PRICE_ASC]: { price: 'asc' },
  [ProductSort.PRICE_DESC]: { price: 'desc' },
  [ProductSort.RATING_DESC]: { avgRating: 'desc' },
  [ProductSort.OLDEST]: { createdAt: 'asc' },
  [ProductSort.NEWEST]: { createdAt: 'desc' },
};

export const buildProductSort = (sort?: ProductSort) =>
  buildSort(sort, productSortMap, { createdAt: 'desc' });
