import { Expose, Type } from 'class-transformer';
import { VariantImageResponseDto } from './variant-image-response.dto';

export class ProductVariantResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  additionalPrice?: number;

  @Expose()
  stock: number;

  @Expose()
  @Type(() => VariantImageResponseDto)
  images: VariantImageResponseDto[];
}
