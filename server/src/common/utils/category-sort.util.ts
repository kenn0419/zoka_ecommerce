import { Prisma } from '@prisma/client';
import { buildSort } from './build-sort.util';
import { CategorySort } from '../enums/category.enum';

const categorySortMap: Record<
  CategorySort,
  Prisma.CategoryOrderByWithRelationInput
> = {
  [CategorySort.NAME_ASC]: { name: 'asc' },
  [CategorySort.NAME_DESC]: { name: 'desc' },
  [CategorySort.NEWEST]: { createdAt: 'desc' },
  [CategorySort.OLDEST]: { createdAt: 'asc' },
};

export const buildCategorySort = (sort?: CategorySort) =>
  buildSort(sort, categorySortMap, { createdAt: 'desc' });
