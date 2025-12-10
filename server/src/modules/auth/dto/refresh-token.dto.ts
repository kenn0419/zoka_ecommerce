import { IsOptional } from 'class-validator';

export class RefreshTokenDto {
  @IsOptional()
  token: string;
}
