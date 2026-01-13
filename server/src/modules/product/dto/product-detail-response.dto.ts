import { Expose } from 'class-transformer';
import { ProductListResponseDto } from './product-list-item-response.dto';
import { ProductVariantResponseDto } from './product-variant-response.dto';
import { CategoryResponseDto } from 'src/modules/category/dto/category-response.dto';
import { ShopResponseDto } from 'src/modules/shop/dto/shop-response.dto';
import { ShopStatus } from 'src/common/enums/shop-status.enum';

export class ProductDetailResponseDto extends ProductListResponseDto {
  @Expose()
  variants: ProductVariantResponseDto[];

  @Expose()
  description: string;

  @Expose()
  category: CategoryResponseDto;

  @Expose()
  shop: ShopResponseDto;

  @Expose()
  status: ShopStatus;
}
