import { Expose } from 'class-transformer';

export class VariantImageResponseDto {
  @Expose()
  id: string;

  @Expose()
  variantId: string;

  @Expose()
  imageUrl: string;
}
