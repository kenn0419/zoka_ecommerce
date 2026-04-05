import { Prisma } from '@prisma/client';
import { buildSort } from './build-sort.util';
import { ProductSort } from '../enums/product.enum';

const productSortMap: Record<
  ProductSort,
  Prisma.ProductOrderByWithRelationInput
> = {
  [ProductSort.PRICE_ASC]: { minPrice: 'asc' },
  [ProductSort.PRICE_DESC]: { maxPrice: 'desc' },
  [ProductSort.RATING_DESC]: { avgRating: 'desc' },
  [ProductSort.OLDEST]: { createdAt: 'asc' },
  [ProductSort.NEWEST]: { createdAt: 'desc' },
};

export const buildProductSort = (sort?: ProductSort) =>
  buildSort(sort, productSortMap, { createdAt: 'desc' });
