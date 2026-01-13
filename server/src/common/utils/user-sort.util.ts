import { Prisma } from 'generated/prisma';
import { buildSort } from './build-sort.util';
import { PaginatedSort } from '../enums/paginated-sort.enum';

const userSortMap: Record<PaginatedSort, Prisma.UserOrderByWithRelationInput> =
  {
    [PaginatedSort.NAME_ASC]: { fullName: 'asc' },
    [PaginatedSort.NAME_DESC]: { fullName: 'desc' },
    [PaginatedSort.NEWEST]: { createdAt: 'desc' },
    [PaginatedSort.OLDEST]: { createdAt: 'asc' },
  };

export const buildUserSort = (sort?: PaginatedSort) =>
  buildSort(sort, userSortMap, { createdAt: 'desc' });
