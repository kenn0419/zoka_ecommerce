import { IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  token: string;
}
