import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FlashSaleStatus } from '@prisma/client';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { FlashSaleSort } from 'src/common/enums/flash-sale.enum';

export class FlashSaleQueryDto extends PaginatedQueryDto<FlashSaleSort> {
  @IsOptional()
  @IsEnum(FlashSaleSort)
  sort?: FlashSaleSort = FlashSaleSort.NEWEST;

  @IsOptional()
  @IsEnum(FlashSaleStatus)
  status?: FlashSaleStatus;
}
