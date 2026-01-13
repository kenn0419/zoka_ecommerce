export default function parseNumberParam(value: string | null) {
  if (value === null) return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}
