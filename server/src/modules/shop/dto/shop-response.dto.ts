import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/modules/user/dto/user-response.dto';

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

  @Expose()
  @Type(() => UserResponseDto)
  owner: UserResponseDto;
}
