import { IsEnum, IsOptional } from 'class-validator';
import { CouponScope } from '@prisma/client';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { CounponSort } from 'src/common/enums/coupon.enum';

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
