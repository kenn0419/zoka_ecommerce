import { Expose } from 'class-transformer';

export class ShopResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  status: string;

  @Expose()
  logoUrl: string;
}
