import { Prisma } from 'generated/prisma';
import { CategorySort } from '../enums/category-sort.enum';
import { buildSort } from './build-sort.util';

const categorySortMap: Record<
  CategorySort,
  Prisma.CategoryOrderByWithRelationInput
> = {
  [CategorySort.NAME_ASC]: { name: 'asc' },
  [CategorySort.NAME_DESC]: { name: 'desc' },
  [CategorySort.NEWEST]: { createdAt: 'desc' },
};

export const buildCategorySort = (sort?: CategorySort) =>
  buildSort(sort, categorySortMap, { createdAt: 'desc' });
