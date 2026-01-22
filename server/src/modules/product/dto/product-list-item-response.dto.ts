import { Expose } from 'class-transformer';
import { ProductStatus } from 'src/common/enums/product-status.enum';

export class ProductListResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  thumbnail: string;

  @Expose()
  avgRating: number;

  @Expose()
  minPrice: number;

  @Expose()
  maxPrice: number;

  @Expose()
  hasStock: boolean;

  @Expose()
  status?: ProductStatus;
}
