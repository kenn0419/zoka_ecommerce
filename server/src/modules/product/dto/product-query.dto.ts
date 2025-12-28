import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ProductSort } from 'src/common/enums/product-sort.enum';

export class ProductListQueryDto {
  @IsOptional()
  @IsString()
  search: string = '';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20;

  @IsOptional()
  @IsEnum(ProductSort)
  sort: ProductSort = ProductSort.OLDEST;
}
