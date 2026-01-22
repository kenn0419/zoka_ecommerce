import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { CouponScope } from 'src/common/enums/coupon-scope.enum';
import { CounponSort } from 'src/common/enums/coupon-sort.enum';

export class CouponQueryDto extends PaginatedQueryDto<CounponSort> {
  @IsOptional()
  @IsEnum(CounponSort)
  sort: CounponSort = CounponSort.OLDEST;

  @IsOptional()
  @IsEnum(CouponScope)
  scope: CouponScope;

  @IsOptional()
  shopId: string;
}
