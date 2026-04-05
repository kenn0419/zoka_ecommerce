import { Prisma } from '@prisma/client';
import { buildSort } from './build-sort.util';
import { PaginatedSort } from '../enums/pagination.enum';

const userSortMap: Record<PaginatedSort, Prisma.UserOrderByWithRelationInput> =
  {
    [PaginatedSort.NAME_ASC]: { fullName: 'asc' },
    [PaginatedSort.NAME_DESC]: { fullName: 'desc' },
    [PaginatedSort.NEWEST]: { createdAt: 'desc' },
    [PaginatedSort.OLDEST]: { createdAt: 'asc' },
  };

export const buildUserSort = (sort?: PaginatedSort) =>
  buildSort(sort, userSortMap, { createdAt: 'desc' });
