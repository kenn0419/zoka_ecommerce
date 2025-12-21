import { Transform } from 'class-transformer';

export function TransformDecimal() {
  return Transform(({ value }) => {
    if (value == null) return null;
    if (typeof value === 'object' && typeof value.toNumber === 'function') {
      return value.toNumber();
    }

    return value;
  });
}
