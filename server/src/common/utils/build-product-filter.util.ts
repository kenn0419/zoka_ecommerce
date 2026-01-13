import { Prisma } from 'generated/prisma';

export function buildProductFilter(params: {
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}): Prisma.ProductWhereInput {
  const { minPrice, maxPrice, rating } = params;

  const where: Prisma.ProductWhereInput = {};

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.AND = [];

    if (minPrice !== undefined) {
      where.AND.push({
        minPrice: { gte: minPrice },
      });
    }

    if (maxPrice !== undefined) {
      where.AND.push({
        maxPrice: { lte: maxPrice },
      });
    }
  }

  if (rating !== undefined) {
    where.avgRating = { gte: rating };
  }

  return where;
}
