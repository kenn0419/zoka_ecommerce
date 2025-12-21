export default function convertDecimalDeep(obj: any): any {
  if (obj == null) return obj;
  if (obj instanceof Date) {
    return obj;
  }
  if (typeof obj?.toNumber === 'function') return obj.toNumber();
  if (Array.isArray(obj)) return obj.map((v) => convertDecimalDeep(v));
  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, convertDecimalDeep(v)]),
    );
  }
  return obj;
}
