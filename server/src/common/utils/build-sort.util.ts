export function buildSort<TOrderBy>(
  sort: string | undefined,
  sortMap: Record<string, TOrderBy>,
  defaultSort: TOrderBy,
): TOrderBy {
  if (!sort) return defaultSort;
  return sortMap[sort] ?? defaultSort;
}
