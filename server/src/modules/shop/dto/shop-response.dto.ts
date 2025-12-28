import { Expose } from 'class-transformer';

export class ShopResponseDto {
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
