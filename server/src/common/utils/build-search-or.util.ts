export function buildSearchOr<T extends string>(
  search: string | undefined,
  fields: T[],
) {
  if (!search) return undefined;

  return fields.map((field) => ({
    [field]: { contains: search, mode: 'insensitive' },
  }));
}
