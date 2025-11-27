import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be greater than or equals to 8 characters',
  })
  password: string;
}
