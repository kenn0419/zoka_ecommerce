import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be greater than or equals to 8 characters',
  })
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be greater than or equals to 8 characters',
  })
  newPassword: string;
}
