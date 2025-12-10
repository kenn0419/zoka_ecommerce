import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/modules/user/dto/user-response.dto';

export class AuthResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  sessionId: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
