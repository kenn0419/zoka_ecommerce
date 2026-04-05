import { PaymentMethod, PaymentProvider } from '@prisma/client';

export function mapMethodToProvider(
  method: PaymentMethod,
): PaymentProvider | null {
  switch (method) {
    case PaymentMethod.MOMO:
      return PaymentProvider.MOMO;
    case PaymentMethod.VNPAY:
      return PaymentProvider.VNPAY;
    case PaymentMethod.COD:
      return null; // COD không có provider
    default:
      return null;
  }
}
