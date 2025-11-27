import { Expose } from 'class-transformer';

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
}
