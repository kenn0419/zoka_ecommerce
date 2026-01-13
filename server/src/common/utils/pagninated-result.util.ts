export async function paginatedResult<TWhere, TOrderBy, TResult>(
  options: {
    where: TWhere;
    page: number;
    limit: number;
    orderBy: TOrderBy;
  },
  executor: (args: {
    where: TWhere;
    page: number;
    limit: number;
    orderBy: TOrderBy;
  }) => Promise<{ items: TResult[]; totalItems: number }>,
) {
  const { items, totalItems } = await executor({
    where: options.where,
    page: options.page,
    limit: options.limit,
    orderBy: options.orderBy,
  });

  return {
    items,
    meta: {
      page: options.page,
      limit: options.limit,
      totalItems,
      totalPages: Math.ceil(totalItems / options.limit),
    },
  };
}
