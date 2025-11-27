import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be greater than or equals to 8 characters',
  })
  password: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Fullname must be greater than or equal to 6 characters',
  })
  fullName: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN', { message: 'Invalid phone number format' })
  phone: string;

  @IsNotEmpty()
  @MinLength(10, {
    message: 'Address must be greater than or equal to 10 characters',
  })
  address: string;
}
