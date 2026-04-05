import { CouponScope, CouponType } from '@prisma/client';
import { customAlphabet } from 'nanoid';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const nanoid = customAlphabet(ALPHABET, 8);

export function generateCouponCode(params: {
  scope: CouponScope;
  type: CouponType;
  discount: number;
}) {
  const scopeMap = {
    GLOBAL: 'GLB',
    SHOP: 'SHP',
    PRODUCT: 'PRD',
    USER: 'USR',
    CATEGORY: 'CAT',
  };

  const typeMap = {
    PERCENT: 'P',
    FIXED: 'K',
  };

  return `${scopeMap[params.scope]}-${typeMap[params.type]}${params.discount}-${nanoid()}`;
}
