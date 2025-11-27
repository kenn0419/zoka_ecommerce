import { PermissionGroups as PG } from './permission.group';
import { Permission as P } from 'src/common/enums/permission.enum';
import { Role } from 'src/common/enums/role.enum';

export const ROLE_PERMISSIONS = {
  [Role.ADMIN]: [
    ...PG.PRODUCT,
    ...PG.CATEGORY,
    ...PG.ORDER,
    ...PG.FLASHSALE,
    ...PG.SHOP,
    ...PG.USER,
    ...PG.RBAC,
  ],

  [Role.SHOP]: [
    // product
    P.PRODUCT_VIEW,
    P.PRODUCT_LIST,
    P.PRODUCT_CREATE,
    P.PRODUCT_UPDATE,
    P.PRODUCT_DELETE,

    // category
    P.CATEGORY_VIEW,
    P.CATEGORY_LIST,

    // flash sale
    P.FLASHSALE_CREATE,
    P.FLASHSALE_UPDATE,
    P.FLASHSALE_DELETE,
    P.FLASHSALE_VIEW,
    P.FLASHSALE_LIST,

    // orders
    P.ORDER_VIEW,
    P.ORDER_LIST,
    P.ORDER_UPDATE_STATUS,

    // shop info
    P.SHOP_UPDATE,
    P.SHOP_VIEW,
  ],

  [Role.USER]: [
    P.PRODUCT_VIEW,
    P.PRODUCT_LIST,

    P.CATEGORY_VIEW,
    P.CATEGORY_LIST,

    P.ORDER_VIEW,
    P.ORDER_LIST,

    P.FLASHSALE_VIEW,
    P.FLASHSALE_LIST,

    P.REVIEW_CREATE,

    P.SHOP_VIEW,
    P.SHOP_LIST,
  ],
};
