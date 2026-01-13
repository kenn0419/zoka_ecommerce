export const getNumberParam = (value: string | null, defaultValue: number) => {
  const n = Number(value);
  return Number.isNaN(n) || n <= 0 ? defaultValue : n;
};
