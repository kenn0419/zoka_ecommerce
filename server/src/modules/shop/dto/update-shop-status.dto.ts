import { IsEnum } from 'class-validator';
import { ShopStatus } from 'src/common/enums/shop-status.enum';

export class UpdateShopStatusDto {
  @IsEnum(ShopStatus)
  status: ShopStatus;
}
