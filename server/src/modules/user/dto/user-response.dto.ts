import { Expose, Type } from 'class-transformer';
import { RoleResponseDto } from 'src/modules/rbac/dto/role-response.dto';

export class UserResponseDto {
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
  roles: RoleResponseDto[];
}
