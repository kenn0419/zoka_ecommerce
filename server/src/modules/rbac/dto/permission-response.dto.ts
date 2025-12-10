import { Expose } from 'class-transformer';

export class PermissionResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;
}
