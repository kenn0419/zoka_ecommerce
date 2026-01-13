import { Expose, Transform, Type } from 'class-transformer';
import { RoleResponseDto } from 'src/modules/rbac/dto/role-response.dto';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  fullName: string;

  @Expose()
  slug: string;

  @Expose()
  phone: string;

  @Expose()
  address: string;

  @Expose()
  avatarUrl: string;

  @Expose()
  status: string;

  @Expose()
  @Type(() => RoleResponseDto)
  roles: RoleResponseDto[];
}
