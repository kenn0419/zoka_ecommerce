import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { ProductSort } from 'src/common/enums/product-sort.enum';

export class ProductListQueryDto extends PaginatedQueryDto<ProductSort> {
  @IsOptional()
  @IsEnum(ProductSort)
  sort: ProductSort = ProductSort.OLDEST;

  @IsOptional()
  @Type(() => Number)
  minPrice: number;

  @IsOptional()
  @Type(() => Number)
  maxPrice: number;

  @IsOptional()
  @Type(() => Number)
  rating: number;
}
