import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { ShopSort } from 'src/common/enums/shop-sort.enum';

export class ShopQueryDto extends PaginatedQueryDto<ShopSort> {
  @IsOptional()
  @IsEnum(ShopSort)
  sort: ShopSort = ShopSort.OLDEST;
}
