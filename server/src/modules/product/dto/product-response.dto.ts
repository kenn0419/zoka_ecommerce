import { Expose, Type } from 'class-transformer';
import { CategoryResponseDto } from 'src/modules/category/dto/category-response.dto';
import { ShopResponse } from 'src/modules/shop/dto/shop-response.dto';
import { ProductVariantResponseDto } from './product-variant-response.dto';

export class ProductResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  category: CategoryResponseDto;

  @Expose()
  price: number;

  @Expose()
  thumbnail: string;

  @Expose()
  stock: number;

  @Expose()
  @Type(() => ProductVariantResponseDto)
  variants: ProductVariantResponseDto[];

  @Expose()
  @Type(() => ShopResponse)
  shop: ShopResponse;
}
