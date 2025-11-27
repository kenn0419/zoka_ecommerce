import { Expose } from 'class-transformer';
import { CategoryResponse } from 'src/modules/category/dto/category.response';
import { ShopResponse } from 'src/modules/shop/dto/shop.response';

export class ProductResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  category: CategoryResponse;

  @Expose()
  shop: ShopResponse;
}
