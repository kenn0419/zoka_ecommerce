import { Expose } from 'class-transformer';
import { PermissionResponseDto } from './permission-response.dto';

export class RoleResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  desription: string;

  @Expose()
  permissions: PermissionResponseDto[];
}
